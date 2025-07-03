#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

// Configuration
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage', 'unused-components', 'unused-pages'];
const NEXT_SPECIFIC_IMPORTS = ['next', 'next/link', 'next/router', 'next/navigation', 'next/image', 'next/font'];

// Track usage
const dependencyUsage = {};
const fileDependencies = {};
const importPatterns = {};

// Initialize
Object.keys(allDependencies).forEach(dep => {
  dependencyUsage[dep] = {
    used: false,
    files: [],
    importTypes: [],
    importCount: 0,
    subImports: new Set()
  };
});

function shouldIgnoreFile(filePath) {
  return IGNORE_DIRS.some(dir => filePath.includes(dir));
}

function extractImports(content, filePath) {
  const imports = [];
  
  // ES6 imports with destructuring
  const es6ImportRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"`]([^'"`]+)['"`]/g;
  let match;
  
  while ((match = es6ImportRegex.exec(content)) !== null) {
    const importPath = match[1];
    const fullMatch = match[0];
    
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      const packageName = importPath.startsWith('@')
        ? importPath.split('/').slice(0, 2).join('/')
        : importPath.split('/')[0];
      const subPath = importPath.substring(packageName.length + 1);
      
      imports.push({
        package: packageName,
        fullPath: importPath,
        subPath: subPath || null,
        type: 'es6',
        fullMatch: fullMatch
      });
    }
  }
  
  // CommonJS requires
  const requireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      const packageName = importPath.startsWith('@')
        ? importPath.split('/').slice(0, 2).join('/')
        : importPath.split('/')[0];
      const subPath = importPath.substring(packageName.length + 1);
      
      imports.push({
        package: packageName,
        fullPath: importPath,
        subPath: subPath || null,
        type: 'commonjs',
        fullMatch: match[0]
      });
    }
  }
  
  // Dynamic imports
  const dynamicImportRegex = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      const packageName = importPath.startsWith('@')
        ? importPath.split('/').slice(0, 2).join('/')
        : importPath.split('/')[0];
      const subPath = importPath.substring(packageName.length + 1);
      
      imports.push({
        package: packageName,
        fullPath: importPath,
        subPath: subPath || null,
        type: 'dynamic',
        fullMatch: match[0]
      });
    }
  }
  
  return imports;
}

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = extractImports(content, filePath);
    
    fileDependencies[filePath] = imports;
    
    imports.forEach(imp => {
      if (dependencyUsage[imp.package]) {
        dependencyUsage[imp.package].used = true;
        dependencyUsage[imp.package].files.push(filePath);
        dependencyUsage[imp.package].importCount++;
        
        if (imp.subPath) {
          dependencyUsage[imp.package].subImports.add(imp.subPath);
        }
        
        if (!dependencyUsage[imp.package].importTypes.includes(imp.type)) {
          dependencyUsage[imp.package].importTypes.push(imp.type);
        }
        
        // Track import patterns
        if (!importPatterns[imp.package]) {
          importPatterns[imp.package] = new Set();
        }
        importPatterns[imp.package].add(imp.fullPath);
      }
    });
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!shouldIgnoreFile(filePath)) {
        walkDirectory(filePath);
      }
    } else if (EXTENSIONS.includes(path.extname(file))) {
      analyzeFile(filePath);
    }
  });
}

// Start analysis
console.log('🔍 Advanced Dependency Analysis...\n');
walkDirectory('.');

// Generate comprehensive report
console.log('📊 COMPREHENSIVE DEPENDENCY REPORT\n');
console.log('=' .repeat(60));

const usedDeps = [];
const unusedDeps = [];

Object.entries(dependencyUsage).forEach(([dep, info]) => {
  if (info.used) {
    usedDeps.push({ name: dep, ...info });
  } else {
    unusedDeps.push(dep);
  }
});

// Sort by usage frequency
usedDeps.sort((a, b) => b.importCount - a.importCount);

console.log(`✅ USED DEPENDENCIES (${usedDeps.length}):`);
console.log('-'.repeat(40));
usedDeps.forEach(dep => {
  console.log(`\n📦 ${dep.name} (${dep.importCount} imports)`);
  console.log(`   Files: ${dep.files.length}`);
  console.log(`   Import types: ${dep.importTypes.join(', ')}`);
  
  if (dep.subImports.size > 0) {
    console.log(`   Sub-imports: ${Array.from(dep.subImports).join(', ')}`);
  }
  
  if (dep.files.length <= 3) {
    dep.files.forEach(file => console.log(`   - ${file}`));
  } else {
    dep.files.slice(0, 2).forEach(file => console.log(`   - ${file}`));
    console.log(`   - ... and ${dep.files.length - 2} more files`);
  }
});

console.log(`\n❌ UNUSED DEPENDENCIES (${unusedDeps.length}):`);
console.log('-'.repeat(40));
if (unusedDeps.length > 0) {
  unusedDeps.forEach(dep => {
    const isDevDep = packageJson.devDependencies && packageJson.devDependencies[dep];
    const type = isDevDep ? '(dev)' : '(prod)';
    console.log(`   ${dep} ${type}`);
  });
} else {
  console.log('   No unused dependencies found! 🎉');
}

// Dependency categories
console.log(`\n📋 DEPENDENCY CATEGORIES:`);
console.log('-'.repeat(40));

const categories = {
  'UI Components': ['@radix-ui', 'lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
  'React & Next.js': ['react', 'react-dom', 'next'],
  'Data & State': ['swr', '@prisma/client'],
  'Date & Time': ['date-fns', 'luxon', 'react-day-picker'],
  'Utilities': ['lodash.debounce', 'cmdk', 'xml2js', 'node-fetch'],
  'Styling': ['tailwindcss-animate']
};

Object.entries(categories).forEach(([category, deps]) => {
  const categoryDeps = usedDeps.filter(dep => 
    deps.some(pattern => dep.name.includes(pattern))
  );
  
  if (categoryDeps.length > 0) {
    console.log(`\n${category}:`);
    categoryDeps.forEach(dep => {
      console.log(`   ${dep.name} (${dep.importCount} imports)`);
    });
  }
});

// Generate removal suggestions
if (unusedDeps.length > 0) {
  console.log(`\n🗑️  REMOVAL COMMANDS:`);
  console.log('-'.repeat(40));
  
  const prodUnused = unusedDeps.filter(dep => packageJson.dependencies && packageJson.dependencies[dep]);
  const devUnused = unusedDeps.filter(dep => packageJson.devDependencies && packageJson.devDependencies[dep]);
  
  if (prodUnused.length > 0) {
    console.log('\nProduction dependencies to remove:');
    console.log(`npm uninstall ${prodUnused.join(' ')}`);
  }
  
  if (devUnused.length > 0) {
    console.log('\nDev dependencies to remove:');
    console.log(`npm uninstall -D ${devUnused.join(' ')}`);
  }
}

// Save detailed report
const report = {
  summary: {
    totalDependencies: Object.keys(allDependencies).length,
    usedDependencies: usedDeps.length,
    unusedDependencies: unusedDeps.length,
    analyzedFiles: Object.keys(fileDependencies).length,
    totalImports: usedDeps.reduce((sum, dep) => sum + dep.importCount, 0)
  },
  usedDependencies: usedDeps.map(dep => ({
    ...dep,
    subImports: Array.from(dep.subImports)
  })),
  unusedDependencies: unusedDeps,
  fileDependencies: fileDependencies,
  importPatterns: Object.fromEntries(
    Object.entries(importPatterns).map(([pkg, patterns]) => [pkg, Array.from(patterns)])
  )
};

fs.writeFileSync('advanced-dependency-report.json', JSON.stringify(report, null, 2));
console.log(`\n💾 Detailed report saved to: advanced-dependency-report.json`);

// Generate visualization data
const visualizationData = {
  used: usedDeps.map(dep => ({
    name: dep.name,
    count: dep.importCount,
    files: dep.files.length
  })),
  unused: unusedDeps.map(dep => ({
    name: dep,
    type: packageJson.devDependencies && packageJson.devDependencies[dep] ? 'dev' : 'prod'
  }))
};

fs.writeFileSync('dependency-visualization.json', JSON.stringify(visualizationData, null, 2));
console.log(`💾 Visualization data saved to: dependency-visualization.json`); 
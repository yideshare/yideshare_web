#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get all dependencies
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

// File extensions to analyze
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage'];

// Track dependency usage
const dependencyUsage = {};
const fileDependencies = {};

// Initialize tracking
Object.keys(allDependencies).forEach(dep => {
  dependencyUsage[dep] = {
    used: false,
    files: [],
    importTypes: []
  };
});

function shouldIgnoreFile(filePath) {
  return IGNORE_DIRS.some(dir => filePath.includes(dir));
}

function extractImports(content, filePath) {
  const imports = [];
  
  // ES6 imports
  const es6ImportRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"`]([^'"`]+)['"`]/g;
  let match;
  
  while ((match = es6ImportRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      // This is a package import
      const packageName = importPath.split('/')[0];
      imports.push({
        package: packageName,
        fullPath: importPath,
        type: 'es6'
      });
    }
  }
  
  // CommonJS requires
  const requireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      const packageName = importPath.split('/')[0];
      imports.push({
        package: packageName,
        fullPath: importPath,
        type: 'commonjs'
      });
    }
  }
  
  // Dynamic imports
  const dynamicImportRegex = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      const packageName = importPath.split('/')[0];
      imports.push({
        package: packageName,
        fullPath: importPath,
        type: 'dynamic'
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
        if (!dependencyUsage[imp.package].importTypes.includes(imp.type)) {
          dependencyUsage[imp.package].importTypes.push(imp.type);
        }
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
console.log('🔍 Analyzing dependencies...\n');
walkDirectory('.');

// Generate report
console.log('📊 DEPENDENCY USAGE REPORT\n');
console.log('=' .repeat(50));

const usedDeps = [];
const unusedDeps = [];

Object.entries(dependencyUsage).forEach(([dep, info]) => {
  if (info.used) {
    usedDeps.push({ name: dep, ...info });
  } else {
    unusedDeps.push(dep);
  }
});

console.log(`✅ USED DEPENDENCIES (${usedDeps.length}):`);
console.log('-'.repeat(30));
usedDeps.forEach(dep => {
  console.log(`\n📦 ${dep.name}`);
  console.log(`   Files: ${dep.files.length}`);
  console.log(`   Import types: ${dep.importTypes.join(', ')}`);
  if (dep.files.length <= 5) {
    dep.files.forEach(file => console.log(`   - ${file}`));
  } else {
    dep.files.slice(0, 3).forEach(file => console.log(`   - ${file}`));
    console.log(`   - ... and ${dep.files.length - 3} more files`);
  }
});

console.log(`\n❌ UNUSED DEPENDENCIES (${unusedDeps.length}):`);
console.log('-'.repeat(30));
if (unusedDeps.length > 0) {
  unusedDeps.forEach(dep => {
    const isDevDep = packageJson.devDependencies && packageJson.devDependencies[dep];
    const type = isDevDep ? '(dev)' : '(prod)';
    console.log(`   ${dep} ${type}`);
  });
} else {
  console.log('   No unused dependencies found! 🎉');
}

// Generate detailed file report
console.log(`\n📁 FILE-BY-FILE DEPENDENCY BREAKDOWN:`);
console.log('-'.repeat(40));
Object.entries(fileDependencies).forEach(([file, imports]) => {
  if (imports.length > 0) {
    console.log(`\n📄 ${file}:`);
    imports.forEach(imp => {
      console.log(`   ${imp.type}: ${imp.fullPath}`);
    });
  }
});

// Save detailed report to file
const report = {
  summary: {
    totalDependencies: Object.keys(allDependencies).length,
    usedDependencies: usedDeps.length,
    unusedDependencies: unusedDeps.length,
    analyzedFiles: Object.keys(fileDependencies).length
  },
  usedDependencies: usedDeps,
  unusedDependencies: unusedDeps,
  fileDependencies: fileDependencies,
  dependencyUsage: dependencyUsage
};

fs.writeFileSync('dependency-report.json', JSON.stringify(report, null, 2));
console.log(`\n💾 Detailed report saved to: dependency-report.json`);

// Generate removal suggestions
if (unusedDeps.length > 0) {
  console.log(`\n🗑️  REMOVAL SUGGESTIONS:`);
  console.log('-'.repeat(30));
  
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
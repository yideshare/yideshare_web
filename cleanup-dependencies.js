#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'node:child_process';
import readline from 'node:readline/promises';

// Read the dependency report
const reportPath = 'advanced-dependency-report.json';

if (!fs.existsSync(reportPath)) {
  console.log('❌ No dependency report found. Please run the analyzer first:');
  console.log('   node advanced-dependency-analyzer.js');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

console.log('🧹 DEPENDENCY CLEANUP TOOL\n');
console.log('=' .repeat(40));

if (report.unusedDependencies.length === 0) {
  console.log('✅ No unused dependencies found! Your project is clean.');
  process.exit(0);
}

console.log(`Found ${report.unusedDependencies.length} unused dependencies:\n`);

// Read package.json to categorize dependencies
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const prodUnused = report.unusedDependencies.filter(dep => 
  packageJson.dependencies && packageJson.dependencies[dep]
);

const devUnused = report.unusedDependencies.filter(dep => 
  packageJson.devDependencies && packageJson.devDependencies[dep]
);

console.log('📦 Production dependencies to remove:');
if (prodUnused.length > 0) {
  prodUnused.forEach(dep => {
    console.log(`   - ${dep}`);
  });
} else {
  console.log('   None');
}

console.log('\n🔧 Dev dependencies to remove:');
if (devUnused.length > 0) {
  devUnused.forEach(dep => {
    console.log(`   - ${dep}`);
  });
} else {
  console.log('   None');
}

// Ask for confirmation
console.log('\n⚠️  WARNING: This will permanently remove these dependencies.');
console.log('Make sure to test your application after removal.\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const answer = await rl.question('Do you want to proceed with removal? (y/N): ');
rl.close();

if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
  console.log('\n🗑️  Removing unused dependencies...\n');
  try {
    // Remove production dependencies
    if (prodUnused.length > 0) {
      console.log('Removing production dependencies...');
      execSync(`npm uninstall ${prodUnused.join(' ')}`, { stdio: 'inherit' });
    }
    // Remove dev dependencies
    if (devUnused.length > 0) {
      console.log('\nRemoving dev dependencies...');
      execSync(`npm uninstall -D ${devUnused.join(' ')}`, { stdio: 'inherit' });
    }
    console.log('\n✅ Cleanup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run your tests to ensure nothing broke');
    console.log('2. Start your development server');
    console.log('3. Check that all features still work');
  } catch (error) {
    console.error('\n❌ Error during cleanup:', error.message);
    console.log('\nYou may need to run the commands manually:');
    if (prodUnused.length > 0) {
      console.log(`npm uninstall ${prodUnused.join(' ')}`);
    }
    if (devUnused.length > 0) {
      console.log(`npm uninstall -D ${devUnused.join(' ')}`);
    }
  }
} else {
  console.log('\n❌ Cleanup cancelled.');
} 
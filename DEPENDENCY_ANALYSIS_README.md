# Dependency Analysis Tools

This project includes automated tools to analyze and clean up dependencies in your Next.js application.

## 📊 Analysis Results Summary

Based on the latest analysis of your codebase:

- **Total Dependencies**: 47
- **Used Dependencies**: 13
- **Unused Dependencies**: 34
- **Files Analyzed**: 42

### 🎯 Key Findings

**Most Used Dependencies:**
- `react` (42 imports) - Core React library
- `lucide-react` (19 imports) - Icon library
- `next` (18 imports) - Next.js framework
- `class-variance-authority` (4 imports) - UI styling
- `date-fns` (3 imports) - Date utilities

**Unused Dependencies (Potential Cleanup):**
- All `@radix-ui/*` packages (14 packages)
- `@prisma/client`, `swr`, `react-dom`
- Various dev dependencies like `eslint`, `typescript`, etc.

## 🛠️ Available Tools

### 1. Basic Dependency Analyzer
```bash
node dependency-analyzer.js
```
- Simple analysis with basic reporting
- Identifies used vs unused dependencies
- Generates `dependency-report.json`

### 2. Advanced Dependency Analyzer (Recommended)
```bash
node advanced-dependency-analyzer.js
```
- Comprehensive analysis with detailed insights
- Categorizes dependencies by type
- Shows import patterns and sub-imports
- Generates `advanced-dependency-report.json` and `dependency-visualization.json`

### 3. Dependency Cleanup Tool
```bash
node cleanup-dependencies.js
```
- Interactive tool to remove unused dependencies
- Separates production vs dev dependencies
- Asks for confirmation before removal
- Provides manual commands as fallback

### 4. HTML Visualizer
Open `dependency-visualizer.html` in your browser to see a visual representation of the dependency analysis.

## 📋 How to Use

### Step 1: Run the Analysis
```bash
# Run the advanced analyzer (recommended)
node advanced-dependency-analyzer.js
```

### Step 2: Review the Results
The analyzer will output:
- Console report with used/unused dependencies
- JSON files with detailed data
- HTML visualization (if you open the HTML file)

### Step 3: Clean Up (Optional)
```bash
# Interactive cleanup tool
node cleanup-dependencies.js
```

Or manually remove dependencies:
```bash
# Remove unused production dependencies
npm uninstall @prisma/client @radix-ui/react-avatar @radix-ui/react-checkbox # ... etc

# Remove unused dev dependencies  
npm uninstall -D eslint typescript @types/node # ... etc
```

## ⚠️ Important Notes

### Before Removing Dependencies

1. **Test Your Application**: Always test thoroughly after removing dependencies
2. **Check Build Process**: Ensure your build still works
3. **Review TypeScript**: Some dev dependencies might be needed for TypeScript compilation
4. **Check Configuration Files**: Some dependencies might be used in config files

### Dependencies That Might Be Needed

Some dependencies might appear unused but are actually needed:

- **Build Tools**: `typescript`, `eslint`, `postcss`, `tailwindcss`
- **Runtime Dependencies**: `react-dom` (might be imported by Next.js)
- **Database**: `@prisma/client` (might be used in API routes)
- **State Management**: `swr` (might be used in server components)

### Special Cases

- **Radix UI Components**: These might be used in your UI components but imported differently
- **Next.js Specific**: Some Next.js features might require specific dependencies
- **Configuration Files**: Dependencies used in config files might not be detected

## 🔍 Manual Verification

After running the analysis, manually verify:

1. **Check your UI components** for Radix UI usage
2. **Review API routes** for Prisma usage
3. **Check configuration files** (next.config.js, tailwind.config.js, etc.)
4. **Test all features** of your application

## 📈 Benefits of Cleanup

- **Reduced Bundle Size**: Smaller production builds
- **Faster Install Times**: Fewer dependencies to install
- **Better Security**: Fewer potential security vulnerabilities
- **Cleaner Codebase**: Easier to maintain and understand

## 🚀 Next Steps

1. Run the analysis: `node advanced-dependency-analyzer.js`
2. Review the results carefully
3. Test your application thoroughly
4. Use the cleanup tool or remove dependencies manually
5. Re-run the analysis to confirm cleanup

## 📁 Generated Files

- `dependency-report.json` - Basic analysis results
- `advanced-dependency-report.json` - Detailed analysis results
- `dependency-visualization.json` - Data for HTML visualization
- `dependency-visualizer.html` - Visual representation

## 🤝 Contributing

If you find issues with the analysis or want to improve the tools:

1. Check the regex patterns in the analyzers
2. Add new file extensions if needed
3. Update the ignore directories list
4. Improve the categorization logic 
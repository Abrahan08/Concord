#!/usr/bin/env node

/**
 * Sunset Theme Validation Script
 * Validates that the new Sunset theme has been properly integrated
 */

const fs = require('fs');
const path = require('path');

console.log('🌅 Validating Sunset Theme Integration...\n');

// Check 1: Theme Provider Configuration
console.log('✅ Step 1: Checking Theme Provider...');
const themeProviderPath = path.join(__dirname, 'components', 'theme-provider.tsx');
const themeProviderContent = fs.readFileSync(themeProviderPath, 'utf8');

const hasThemeDefinition = themeProviderContent.includes('sunset: {');
const hasThemeName = themeProviderContent.includes("name: 'Sunset'");
const hasThemeArray = themeProviderContent.includes("'sunset'");
const hasGoldAccent = themeProviderContent.includes('gold: {');

console.log('  - Theme definition:', hasThemeDefinition ? '✅' : '❌');
console.log('  - Theme name:', hasThemeName ? '✅' : '❌');
console.log('  - Theme in array:', hasThemeArray ? '✅' : '❌');
console.log('  - Gold accent color:', hasGoldAccent ? '✅' : '❌');

// Check 2: CSS Variables
console.log('\n✅ Step 2: Checking CSS Variables...');
const globalsCssPath = path.join(__dirname, 'app', 'globals.css');
const globalsCssContent = fs.readFileSync(globalsCssPath, 'utf8');

const hasSunsetTheme = globalsCssContent.includes('.sunset {');
const hasSunsetAcrylic = globalsCssContent.includes('.sunset .acrylic {');
const hasSunsetAcrylicLight = globalsCssContent.includes('.sunset .acrylic-light {');
const hasSunsetAcrylicDark = globalsCssContent.includes('.sunset .acrylic-dark {');

console.log('  - Sunset theme CSS:', hasSunsetTheme ? '✅' : '❌');
console.log('  - Acrylic effect:', hasSunsetAcrylic ? '✅' : '❌');
console.log('  - Acrylic light:', hasSunsetAcrylicLight ? '✅' : '❌');
console.log('  - Acrylic dark:', hasSunsetAcrylicDark ? '✅' : '❌');

// Check 3: Theme Hook
console.log('\n✅ Step 3: Checking Theme Hook...');
const useThemePath = path.join(__dirname, 'hooks', 'use-theme.tsx');
const useThemeContent = fs.readFileSync(useThemePath, 'utf8');

const hasGoldColorMapping = useThemeContent.includes('gold: {');

console.log('  - Gold color mapping:', hasGoldColorMapping ? '✅' : '❌');

// Check 4: Test Page
console.log('\n✅ Step 4: Checking Test Page...');
const testThemePath = path.join(__dirname, 'app', 'test-theme', 'page.tsx');
const testThemeContent = fs.readFileSync(testThemePath, 'utf8');

const testPageHasSunset = testThemeContent.includes("'sunset'");

console.log('  - Test page includes sunset:', testPageHasSunset ? '✅' : '❌');

// Summary
console.log('\n🌅 Sunset Theme Integration Summary:');
const allChecks = [
  hasThemeDefinition,
  hasThemeName,
  hasThemeArray,
  hasGoldAccent,
  hasSunsetTheme,
  hasSunsetAcrylic,
  hasSunsetAcrylicLight,
  hasSunsetAcrylicDark,
  hasGoldColorMapping,
  testPageHasSunset
];

const passedChecks = allChecks.filter(Boolean).length;
const totalChecks = allChecks.length;

console.log(`Status: ${passedChecks}/${totalChecks} checks passed`);

if (passedChecks === totalChecks) {
  console.log('🎉 All validations passed! Sunset theme is ready for testing.');
  console.log('\n📋 Next Steps:');
  console.log('1. Visit http://localhost:3000/test-theme');
  console.log('2. Test theme switching to "Sunset"');
  console.log('3. Try different accent colors including "Gold"');
  console.log('4. Verify acrylic effects and responsive design');
  console.log('5. Check settings page at /settings/appearance');
} else {
  console.log('❌ Some validations failed. Please review the implementation.');
}

console.log('\n🔍 Theme Configuration Details:');
console.log('- Theme ID: sunset');
console.log('- Display Name: Sunset');
console.log('- Description: Warm orange and purple sunset theme');
console.log('- Preview: from-orange-900 to-purple-900/30');
console.log('- New Accent Color: Gold (#f59e0b)');
console.log('- Total Theme Combinations: 6 themes × 8 accent colors = 48 combinations');

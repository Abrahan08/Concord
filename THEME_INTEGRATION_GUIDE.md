# Concord Theme Integration Guide
*Complete reference for adding new themes to the Concord Discord-inspired messaging app*

## Overview
This guide provides a foolproof methodology for safely integrating new themes into the Concord app without breaking existing functionality. Follow this process exactly for consistent, reliable theme additions.

## Theme System Architecture

### Current Theme Structure
- **Total Themes:** 6 (neon, dark, midnight, matrix, cyberpunk, sunset)
- **Total Accent Colors:** 8 (blue, green, orange, red, purple, pink, yellow, gold)
- **Total Combinations:** 48 unique theme variations

### Core Files Involved
1. `components/theme-provider.tsx` - Theme configuration and definitions
2. `app/globals.css` - CSS variables and styling
3. `hooks/use-theme.tsx` - Theme logic and accent color mappings
4. `app/test-theme/page.tsx` - Testing interface
5. Optional: `app/settings/appearance/page.tsx` - Settings UI

## Pre-Integration Questions

Before adding a new theme, gather this information:

### 1. Theme Identity
- **Theme Name:** (e.g., "Ocean", "Forest", "Rose")
- **Theme Key:** (lowercase, no spaces, e.g., "ocean", "forest", "rose")
- **Description:** (brief description for UI, e.g., "Cool blue ocean-inspired theme")

### 2. Color Palette (Required)
- **Primary Color:** Main brand color (hex code)
- **Secondary Color:** Supporting color (hex code)
- **Background:** Main background color (hex code)
- **Foreground:** Main text color (hex code)
- **Card Background:** Panel/card background (hex code)
- **Border Color:** Subtle border color (hex code)

### 3. Semantic Colors (Required)
- **Muted:** Subtle text color (hex code)
- **Popover:** Popup background (hex code)
- **Accent:** Interactive elements (hex code)
- **Accent Foreground:** Text on accent backgrounds (hex code)

### 4. Component Colors (Required)
- **Destructive:** Error/delete actions (hex code)
- **Destructive Foreground:** Text on destructive backgrounds (hex code)
- **Ring:** Focus ring color (hex code)
- **Input:** Form input background (hex code)

### 5. Optional New Accent Color
- **Add New Accent:** Yes/No
- **Accent Name:** (e.g., "silver", "bronze", "teal")
- **Accent Primary:** HSL values for primary shade
- **Accent Secondary:** HSL values for secondary shade

### 6. Acrylic Effects (Required)
- **Base Acrylic:** rgba color for glassmorphism effect
- **Light Acrylic:** rgba color for light variant
- **Dark Acrylic:** rgba color for dark variant

## 8-Step Integration Process

### Step 1: Update Theme Provider Configuration
**File:** `components/theme-provider.tsx`

Add new theme object to the `themes` configuration:

```typescript
[themeKey]: {
  name: '[Theme Name]',
  description: '[Theme Description]',
  primary: '[Primary Color]',
  secondary: '[Secondary Color]',
  background: '[Background Color]',
  foreground: '[Foreground Color]',
  card: '[Card Background]',
  cardForeground: '[Card Foreground]',
  popover: '[Popover Background]',
  popoverForeground: '[Popover Foreground]',
  muted: '[Muted Background]',
  mutedForeground: '[Muted Foreground]',
  border: '[Border Color]',
  input: '[Input Background]',
  ring: '[Ring Color]',
  accent: '[Accent Color]',
  accentForeground: '[Accent Foreground]',
  destructive: '[Destructive Color]',
  destructiveForeground: '[Destructive Foreground]',
},
```

Add new accent color (if applicable):
```typescript
[accentKey]: {
  name: '[Accent Name]',
  value: '[Accent Hex Value]',
},
```

Update themes array in NextThemesProvider:
```typescript
themes={['neon', 'dark', 'midnight', 'matrix', 'cyberpunk', 'sunset', '[new-theme-key]']}
```

### Step 2: Add CSS Variables
**File:** `app/globals.css`

Add complete CSS variable definitions:

```css
/* [Theme Name] Theme */
.[theme-key] {
  --background: [background-hsl];
  --foreground: [foreground-hsl];
  --card: [card-hsl];
  --card-foreground: [card-foreground-hsl];
  --popover: [popover-hsl];
  --popover-foreground: [popover-foreground-hsl];
  --primary: [primary-hsl];
  --primary-foreground: [primary-foreground-hsl];
  --secondary: [secondary-hsl];
  --secondary-foreground: [secondary-foreground-hsl];
  --muted: [muted-hsl];
  --muted-foreground: [muted-foreground-hsl];
  --accent: [accent-hsl];
  --accent-foreground: [accent-foreground-hsl];
  --destructive: [destructive-hsl];
  --destructive-foreground: [destructive-foreground-hsl];
  --border: [border-hsl];
  --input: [input-hsl];
  --ring: [ring-hsl];
}

/* Acrylic Effects */
.[theme-key] .acrylic {
  background: [base-acrylic-rgba];
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid [border-rgba];
}

.[theme-key] .acrylic-light {
  background: [light-acrylic-rgba];
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid [light-border-rgba];
}

.[theme-key] .acrylic-dark {
  background: [dark-acrylic-rgba];
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid [dark-border-rgba];
}
```

### Step 3: Update Theme Hook (if new accent color)
**File:** `hooks/use-theme.tsx`

Add new accent color mapping:
```typescript
[accentKey]: { primary: '[primary-hsl]', secondary: '[secondary-hsl]' }
```

### Step 4: Update Test Page
**File:** `app/test-theme/page.tsx`

Add new theme to themes array:
```typescript
const themes = ['neon', 'dark', 'midnight', 'matrix', 'cyberpunk', 'sunset', '[new-theme-key]']
```

### Step 5: Test Integration
Run validation commands:
```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Search for theme references
grep -r "[theme-key]" --include="*.tsx" --include="*.ts" --include="*.css" .
```

### Step 6: Browser Testing
1. Navigate to test page: `http://localhost:3000/test-theme`
2. Select new theme from dropdown
3. Test all accent color combinations
4. Verify visual elements and contrast
5. Test responsive behavior

### Step 7: Validation Checklist
- [ ] Theme appears in theme selector
- [ ] All accent colors work with new theme
- [ ] Acrylic effects render correctly
- [ ] Text contrast is readable
- [ ] No console errors
- [ ] Responsive design works
- [ ] All UI components display properly

### Step 8: Optional Settings Integration
**File:** `app/settings/appearance/page.tsx`

Update theme options if needed (usually automatic via theme provider).

## Color Conversion Helpers

### Hex to HSL Conversion
Use online tools or this formula:
- Hex: #f97316
- HSL: 24 95% 53%
- CSS Format: `24 95% 53%`

### RGBA for Acrylic Effects
Base formula: `rgba(r, g, b, alpha)`
- Light acrylic: alpha 0.1-0.2
- Base acrylic: alpha 0.2-0.3  
- Dark acrylic: alpha 0.3-0.4

## Common Theme Patterns

### Warm Themes
- Use orange, red, yellow base colors
- Higher saturation for cozy feel
- Darker backgrounds with warm undertones

### Cool Themes  
- Use blue, teal, purple base colors
- Medium saturation for professional feel
- Can use lighter or darker backgrounds

### High Contrast Themes
- Strong contrast between background/foreground
- Bright accent colors
- Bold, vibrant appearance

### Subtle Themes
- Low contrast, muted colors
- Gentle, easy-on-eyes appearance
- Sophisticated, minimal aesthetic

## Troubleshooting

### Common Issues
1. **Theme not appearing:** Check themes array in NextThemesProvider
2. **Colors not applying:** Verify CSS variable format (space-separated HSL)
3. **Accent colors broken:** Check useTheme hook accent mappings
4. **TypeScript errors:** Ensure all theme properties are defined

### Quick Fixes
- Clear browser cache and restart dev server
- Check for typos in theme keys
- Verify CSS syntax (semicolons, brackets)
- Ensure all required colors are provided

## Examples

### Successful Theme: Sunset
- **Key:** sunset
- **Colors:** Warm orange/purple palette
- **Accent:** Added gold accent color
- **Style:** Warm, welcoming, high contrast

### Theme Ideas for Future
- **Ocean:** Blue/teal palette, calm and professional
- **Forest:** Green/brown palette, natural and earthy
- **Rose:** Pink/burgundy palette, elegant and romantic
- **Arctic:** Ice blue/white palette, clean and minimal

## Integration Automation

This guide enables quick theme addition by:
1. Following the exact 8-step process
2. Using the pre-integration questions as a checklist
3. Copying the code patterns with theme-specific values
4. Running the same validation steps every time

## File Templates

### Theme Configuration Template
```typescript
[themeKey]: {
  name: '[Name]',
  description: '[Description]',
  primary: '[hex]',
  secondary: '[hex]',
  background: '[hex]',
  foreground: '[hex]',
  card: '[hex]',
  cardForeground: '[hex]',
  popover: '[hex]',
  popoverForeground: '[hex]',
  muted: '[hex]',
  mutedForeground: '[hex]',
  border: '[hex]',
  input: '[hex]',
  ring: '[hex]',
  accent: '[hex]',
  accentForeground: '[hex]',
  destructive: '[hex]',
  destructiveForeground: '[hex]',
},
```

### CSS Variables Template
```css
.[themeKey] {
  --background: [hsl];
  --foreground: [hsl];
  --card: [hsl];
  --card-foreground: [hsl];
  --popover: [hsl];
  --popover-foreground: [hsl];
  --primary: [hsl];
  --primary-foreground: [hsl];
  --secondary: [hsl];
  --secondary-foreground: [hsl];
  --muted: [hsl];
  --muted-foreground: [hsl];
  --accent: [hsl];
  --accent-foreground: [hsl];
  --destructive: [hsl];
  --destructive-foreground: [hsl];
  --border: [hsl];
  --input: [hsl];
  --ring: [hsl];
}
```

---

*Last Updated: June 2025*
*Version: 1.0*
*Total Themes Supported: 6+ (Scalable)*

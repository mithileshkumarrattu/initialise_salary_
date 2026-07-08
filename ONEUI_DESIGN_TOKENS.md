# One UI Design System - Complete Token Reference

## 🎨 Color Palette

### Primary Colors
- **Primary Purple**: `#8F7AFF` (HSL: 262 100% 55%)
  - Use for: Buttons, headers, primary actions, focus states
  - Dark mode variant: Lighter at 65%
  
- **Secondary Purple**: `#8644D7` (HSL: 270 68% 50%)
  - Use for: Secondary actions, hover states, accents
  - Less prominent than primary

### Accent Colors
- **Galaxy AI Cyan**: `#00D4FF` (HSL: 188 100% 50%)
  - Use for: AI features, special highlights, success confirmations
  - Dark mode: Lightened to 65%
  
- **Alert Yellow**: `#FFD700` (HSL: 45 100% 50%)
  - Use for: Warnings, pending states, important notices
  - Dark mode: Lightened to 60%

### Semantic Colors
- **Success**: `#24C856` (HSL: 142 76% 36%)
- **Error/Destructive**: `#FF3B30` (HSL: 0 84% 60%)
- **Warning**: `#FFB400` (HSL: 38 92% 50%)
- **Info**: `#64B5F6` (HSL: 217 91% 60%)

### Neutrals - Light Mode
- **Background**: `#FFFFFF` (0 0% 100%)
- **Foreground/Text**: `#1A1B2E` (224 71% 4%)
- **Card Background**: `#FFFFFF` (0 0% 100%)
- **Border/Input**: `#E8E9F0` (224 13% 91%)
- **Muted Text**: `#565A6F` (215 14% 34%)
- **Muted Background**: `#E8E9F0` (224 13% 91%)

### Neutrals - Dark Mode
- **Background**: `#1F202E` (224 15% 12%)
- **Foreground/Text**: `#FAFAFA` (0 0% 98%)
- **Card Background**: `#292A3C` (224 15% 16%)
- **Border/Input**: `#3A3C52` (224 9% 22%)
- **Muted Text**: `#B3B5C5` (224 8% 70%)
- **Muted Background**: `#3A3C52` (224 9% 22%)

---

## 📝 Typography

### Font Stack
**Primary Font**: `One UI Sans` (Variable weight, 100-900)
**Fallback**: `Inter` → `system-ui` → `sans-serif`

### Type Hierarchy

#### Title
- Size: 36px (2.25rem)
- Weight: 700 (Bold)
- Line Height: 1.2
- Letter Spacing: -0.5px
- Use: Main page titles, hero headlines

#### Heading
- Size: 24px (1.5rem)
- Weight: 600 (Semibold)
- Line Height: 1.3
- Use: Section headers, major headings

#### Subtitle
- Size: 20px (1.25rem)
- Weight: 700 (Bold)
- Line Height: 1.4
- Use: Important subtitles, emphasis

#### Subheading
- Size: 16px (1rem)
- Weight: 400 (Regular)
- Line Height: 1.5
- Use: Section labels, smaller headers

#### Body
- Size: 14px (0.875rem)
- Weight: 400 (Regular)
- Line Height: 1.6
- Use: Main body text, descriptions

**All text is in Sentence case**, where the first letter is capitalized and the rest remain lowercase.

---

## 🎯 Spacing & Radius

### Spacing Scale
- `2px`: Minimal gaps
- `4px` (0.25rem): Tight spacing
- `8px` (0.5rem): Standard padding
- `12px` (0.75rem): Content spacing
- `16px` (1rem): Card margins
- `24px` (1.5rem): Section spacing
- `32px` (2rem): Large gaps
- `48px` (3rem): Hero spacing

### Border Radius
- **Small**: `4px` (0.25rem) - Buttons, small elements
- **Standard**: `12px` (0.75rem) - Cards, inputs, modals
- **Medium**: `16px` (1rem) - Larger cards
- **Large**: `24px` (1.5rem) - Dialog boxes, hero sections

---

## ✨ Blur Effects (One UI Style)

These are applied as CSS backdrop-filter blurs on overlays and dialogs:

### Light Blur (dialogs)
```css
backdrop-filter: blur(48px);
opacity: 50%;
```
- Use for: Light overlay dialogs, semi-transparent backgrounds
- Result: Soft, smooth glassmorphism effect

### Medium Blur
```css
backdrop-filter: blur(36px);
opacity: 60%;
```
- Use for: Toast notifications, popovers

### Heavy Blur
```css
backdrop-filter: blur(24px);
opacity: 70%;
```
- Use for: Modal underlay, full-page overlays

---

## 🎨 Component Color Usage

### Buttons
- **Primary Button**: Background `#8F7AFF`, Text `#FFFFFF`
- **Secondary Button**: Background `#E8E9F0` (light) / `#3A3C52` (dark), Text primary color
- **Danger Button**: Background `#FF3B30`, Text `#FFFFFF`
- **Ghost Button**: Transparent, border primary color

### Inputs & Forms
- **Background**: `--input` (light: `#E8E9F0`, dark: `#3A3C52`)
- **Border**: `--border` (light: `#E8E9F0`, dark: `#3A3C52`)
- **Focus Ring**: `#8F7AFF` (primary)
- **Text**: `--foreground`

### Cards
- **Background**: `--card`
- **Border**: `--border` (optional, light 1-2px)
- **Shadow**: `0 2px 8px rgba(0,0,0,0.08)` (light mode)
- **Shadow**: `0 2px 8px rgba(0,0,0,0.32)` (dark mode)

### Navigation
- **Active**: Primary color background
- **Hover**: Primary color at 80% opacity
- **Inactive**: Muted text color

---

## 🌓 Dark Mode

- Use CSS `prefers-color-scheme: dark` media query
- Override colors in `.dark` class
- Ensure 7:1 contrast ratio for accessibility
- Icons should invert or have variants

---

## 📐 Responsive Breakpoints

- **Mobile**: 320px - 640px (small screens)
- **Tablet**: 641px - 1024px (medium screens)
- **Desktop**: 1025px+ (large screens)

---

## 💾 CSS Variable Usage

All colors are available as CSS custom properties:

```css
/* Light Mode (automatic) */
background-color: hsl(var(--primary));
color: hsl(var(--primary-foreground));

/* Dark Mode (in .dark class) */
background-color: hsl(var(--primary));
```

---

## 🔧 Implementation Rules

1. **NEVER hardcode colors** - Always use CSS variables
2. **Use Tailwind for layout** - CSS Grid/Flexbox only
3. **Blur effects** - Only on overlay/modal backgrounds
4. **Typography** - Use One UI Sans font family
5. **Shadows** - Subtle, light-based on mode
6. **Transitions** - 200ms ease for interactions
7. **Corner radius** - Never exceed 24px for standard elements

---

## 🎯 Quick Color References

| Usage | Light Mode | Dark Mode | CSS Variable |
|-------|-----------|-----------|--------------|
| Primary Action | #8F7AFF | #E0C7FF | var(--primary) |
| Secondary | #8644D7 | #A855FD | var(--secondary) |
| Success | #24C856 | #34C759 | var(--success) |
| Warning | #FFB400 | #FFD60A | var(--warning) |
| Error | #FF3B30 | #FF453A | var(--error) |
| Text | #1A1B2E | #FAFAFA | var(--foreground) |
| Border | #E8E9F0 | #3A3C52 | var(--border) |
| Background | #FFFFFF | #1F202E | var(--background) |

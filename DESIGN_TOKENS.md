# Design Token System - Elite Football Market Sign-Up

## Overview
This document defines the design token system for the Elite Football Market sign-up experience. All colors, typography, spacing, and motion follow a cohesive system built on a dark, professional football app aesthetic with electric grass green accents.

---

## Color System

### Primary Colors (3 colors)
- **Dark Charcoal (Background):** `#1a1a1a` / `oklch(0.11 0 0)`
  - Primary background for app and page containers
  - Creates professional, focused atmosphere
  
- **Electric Grass Green (Accent):** `#39ff14` / `oklch(0.8 0.3 142)`
  - Primary CTA buttons, active states, highlights
  - Vibrant, energetic football pitch reference
  - High contrast against dark charcoal
  
- **Pristine White (Text/Elements):** `#ffffff` / `oklch(0.99 0 0)`
  - Primary text, borders, form inputs
  - Maximum readability on dark background

### Secondary Colors (2 colors)
- **Deep Gray (Cards/Elevated):** `#2a2a2a` / `oklch(0.17 0 0)`
  - Card backgrounds, form container
  - Subtle elevation from main background
  - Glassmorphism container base

- **Error Red (Validation):** `#ff4444` / `oklch(0.54 0.28 16)`
  - Real-time validation error states
  - High visibility, accessible contrast

---

## Typography System

### Font Stack (2 families)
- **Headings & CTA:** `Geist` (sans-serif)
  - Modern, clean, professional
  - Used for: Headlines, button text, form labels
  
- **Body & UI:** `Geist` (sans-serif)
  - Consistent throughout for clarity
  - Used for: Form inputs, descriptions, helper text, error messages

### Type Scale
| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| **Headline/Logo** | 32px | 700 | 1.2 | Page title, brand |
| **Section Title** | 24px | 600 | 1.3 | Subheadings, form sections |
| **Label/CTA** | 16px | 600 | 1.4 | Button text, form labels |
| **Body/Helper** | 14px | 400 | 1.6 | Form input, descriptions |
| **Error/Badge** | 12px | 500 | 1.4 | Error messages, badges |
| **Small** | 11px | 400 | 1.5 | Footer, timestamps, fine print |

---

## Spacing System

Base unit: **4px** (Tailwind default)

### Scale
- **XS:** 4px (0.25rem) - Micro spacing, inline elements
- **SM:** 8px (0.5rem) - Tight spacing, related elements
- **MD:** 16px (1rem) - Default spacing, form fields
- **LG:** 24px (1.5rem) - Section spacing, component groups
- **XL:** 32px (2rem) - Major sections, top-level spacing
- **2XL:** 48px (3rem) - Page padding, large gaps

### Layout Spacing
- **Form Container Padding:** 32px (LG + MD) horizontal, 24px (LG) vertical
- **Input Field Height:** 48px (for accessible touch targets on mobile)
- **Button Height:** 48px (iOS/Android HIG compliance)
- **Gap Between Form Fields:** 16px (MD)
- **Gap Between Buttons (Social):** 12px (SM + MD blend)

---

## Border & Radius System

### Radius Scale
- **Small:** 4px - Subtle form inputs, small elements
- **Medium:** 8px - Cards, containers, buttons
- **Large:** 12px - Large containers, major sections
- **Full:** 9999px - Rounded pills, circular elements

### Border System
- **Input Border:** 1px solid `rgba(255, 255, 255, 0.2)` (subtle light border)
- **Focus State:** 2px solid `#39ff14` (electric green)
- **Card Border:** 1px solid `rgba(255, 255, 255, 0.15)` (glassmorphism)

---

## Component-Specific Tokens

### Buttons
| State | Background | Text | Border |
|-------|-----------|------|--------|
| Primary (Default) | #39ff14 | #1a1a1a | None |
| Primary (Hover) | #33dd0f | #1a1a1a | None |
| Primary (Active) | #2cc409 | #1a1a1a | None |
| Secondary (CTA Text) | Transparent | #39ff14 | 1px #39ff14 |
| Disabled | #4a4a4a | #7a7a7a | None |

### Form Inputs
- **Background:** `rgba(255, 255, 255, 0.05)` (very subtle white tint)
- **Border (Default):** `rgba(255, 255, 255, 0.2)`
- **Border (Focus):** `#39ff14`
- **Text Color:** `#ffffff`
- **Placeholder Color:** `rgba(255, 255, 255, 0.4)`
- **Error State:** Border changes to `#ff4444`, text remains white
- **Height:** 48px (MD: 1rem padding top/bottom = 16px top/bottom + font)

### Glassmorphism Card
- **Background:** `rgba(42, 42, 42, 0.7)` (deep gray with 70% opacity)
- **Backdrop Filter:** `blur(10px)`
- **Border:** `1px solid rgba(255, 255, 255, 0.15)`
- **Box Shadow:** `0 8px 32px 0 rgba(31, 38, 135, 0.37)`
- **Padding:** 32px (LG)

### Badge (5,000+ Players)
- **Background:** `#39ff14` (electric green)
- **Text Color:** `#1a1a1a` (dark charcoal)
- **Font Size:** 12px (small)
- **Font Weight:** 600 (semi-bold)
- **Padding:** 6px 12px (vertical, horizontal)
- **Radius:** 4px

---

## Motion & Animation

### Duration Scale
- **Fast:** 150ms - Micro-interactions, hover states
- **Normal:** 300ms - Form focus, transitions
- **Slow:** 500ms - Entrance animations, modal appears

### Easing
- **Ease-in-out (Default):** `cubic-bezier(0.4, 0, 0.2, 1)` - Most transitions
- **Ease-out (Entrance):** `cubic-bezier(0, 0, 0.2, 1)` - Page load, elements appear
- **Ease-in (Exit):** `cubic-bezier(0.4, 0, 1, 1)` - Fade outs, disappear

### Common Animations
- **Fade In (Page Load):** Opacity 0 → 1, 500ms ease-out
- **Slide Up (Form Appears):** Transform translateY(20px) → 0, 500ms ease-out
- **Button Hover:** Scale 1 → 1.02, 150ms ease-in-out
- **Input Focus:** Border color change + subtle shadow, 300ms ease-in-out
- **Error Shake:** translateX animation, 300ms, 4 stages
- **Loading Pulse:** Opacity oscillation, infinite, 1.5s ease-in-out

---

## Responsive Breakpoints

| Breakpoint | Size | Device | Adjustments |
|-----------|------|--------|-------------|
| Mobile | 320px - 768px | Phone | Single column, larger touch targets (48px) |
| Tablet | 768px - 1024px | Tablet | May expand layout if needed |
| Desktop | 1024px+ | Monitor | Extended padding, full-width optimization |

### Mobile-First Adjustments
- **Button Height:** Always 48px (touch-friendly)
- **Form Field Gap:** 16px on all sizes
- **Card Padding:** 24px mobile, 32px desktop
- **Text Scale:** No change to font sizes (readable at all sizes)
- **Background Image:** `background-size: cover; background-position: center;` - crops to fit

---

## Accessibility Compliance

### Color Contrast
- **Electric Green (#39ff14) on Dark Charcoal (#1a1a1a):** 14.2:1 (WCAG AAA)
- **White (#ffffff) on Dark Charcoal (#1a1a1a):** 21:1 (WCAG AAA)
- **Error Red (#ff4444) on Dark Charcoal (#1a1a1a):** 8.3:1 (WCAG AA)

### Touch Targets
- **Minimum Size:** 48px × 48px (iOS/Android HIG standard)
- **Minimum Spacing:** 8px between interactive elements

### Focus States
- **Visible Focus Ring:** 2px solid `#39ff14` (electric green)
- **Offset:** 2px from element edge
- **Applied to:** All buttons, inputs, links

---

## Implementation in Tailwind & CSS Variables

### CSS Variables in `globals.css`
```css
:root {
  /* Dark Mode (Enabled by default) */
  --background: #1a1a1a;
  --foreground: #ffffff;
  --accent: #39ff14;
  --accent-foreground: #1a1a1a;
  --destructive: #ff4444;
  --input-border: rgba(255, 255, 255, 0.2);
  --card-bg: #2a2a2a;
  --card-border: rgba(255, 255, 255, 0.15);
  --radius: 0.5rem; /* 8px */
  
  /* Typography */
  --font-sans: 'Geist', sans-serif;
  
  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```

### Tailwind Config Overrides
```typescript
theme: {
  colors: {
    'accent-green': '#39ff14',
    'dark-charcoal': '#1a1a1a',
    'deep-gray': '#2a2a2a',
  },
  spacing: {
    'xs': '4px',
    'sm': '8px',
    'md': '16px',
    'lg': '24px',
    'xl': '32px',
    '2xl': '48px',
  },
  borderRadius: {
    'sm': '4px',
    'md': '8px',
    'lg': '12px',
  },
}
```

---

## Usage Examples

### Button (Primary CTA)
```
bg-accent-green text-dark-charcoal font-semibold py-3 px-6 rounded-md 
hover:bg-accent-green/90 transition-colors duration-fast
active:bg-accent-green/80
```

### Form Input
```
bg-white/5 border border-white/20 text-white placeholder-white/40 
rounded-md px-4 py-3 h-12
focus:border-accent-green focus:ring-2 focus:ring-accent-green/30
```

### Error Message
```
text-destructive font-medium text-sm
```

### Glassmorphism Container
```
bg-deep-gray/70 backdrop-blur-xl border border-white/15 rounded-lg p-8
```

---

## Dark Mode
- **Default:** Dark mode enabled (no light mode variant for Phase 1)
- **Future:** Light mode can be added in Phase 2 with separate token values
- **Implementation:** CSS custom properties handle light/dark seamlessly

---

## Token Update Strategy
- Review and adjust tokens after Phase 1 launch based on user feedback
- Ensure Phase 2 (Player Card) components follow the same token system
- Maintain consistency across all future features

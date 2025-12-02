# ResuMate Style Guide

**Version:** 1.0.0
**Last Updated:** December 1, 2025
**Status:** Production Ready

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Components](#components)
7. [Layout Guidelines](#layout-guidelines)
8. [Accessibility](#accessibility)
9. [Responsive Design](#responsive-design)
10. [Code Standards](#code-standards)

---

## Overview

This style guide defines the visual language and design system for ResuMate, ensuring consistency across all 16 test pages and features. All design tokens are centralized in `/css/variables.css` and should be used throughout the application.

### Design System Files

- **`/css/variables.css`** - All design tokens (colors, typography, spacing, etc.)
- **`/css/navigation.css`** - Unified navigation system
- **`/css/notifications.css`** - Toast notifications and alerts
- **`/js/utils/notifications.js`** - Notification JavaScript utilities

---

## Design Principles

### 1. Consistency First
- Use CSS variables for all design tokens
- Maintain uniform spacing with 8px grid system
- Apply consistent component patterns across features

### 2. Accessibility Always
- WCAG AA compliance minimum (AAA preferred)
- 4.5:1 contrast ratio for normal text
- 3:1 contrast ratio for large text and UI components
- Full keyboard navigation support
- Screen reader friendly

### 3. Performance Matters
- Minimize CSS specificity
- Use efficient selectors
- Lazy load heavy components
- Target <2s page load time

### 4. Mobile First
- Design for mobile, enhance for desktop
- Touch-friendly targets (minimum 44x44px)
- Responsive breakpoints at 640px, 768px, 1024px, 1280px

---

## Color Palette

All colors are defined as CSS variables in `/css/variables.css`. Use these tokens instead of hardcoded values.

### Primary Colors

```css
--color-primary: #6366f1        /* Main brand color */
--color-primary-dark: #4f46e5   /* Hover/active states */
--color-primary-light: #818cf8  /* Subtle highlights */
--color-primary-lighter: #c7d2fe /* Backgrounds */
--color-primary-bg: rgba(99, 102, 241, 0.1) /* Transparent overlay */
```

**Usage:**
- Primary actions (buttons, links)
- Active states
- Focus indicators
- Brand elements

**Accessibility:** All primary colors meet WCAG AA contrast requirements when used with white text.

### Semantic Colors

#### Success (Green)
```css
--color-success: #10b981
--color-success-dark: #059669
--color-success-light: #34d399
--color-success-bg: rgba(16, 185, 129, 0.1)
```

**Usage:** Confirmations, successful operations, positive feedback

#### Warning (Amber)
```css
--color-warning: #f59e0b
--color-warning-dark: #d97706
--color-warning-light: #fbbf24
--color-warning-bg: rgba(245, 158, 11, 0.1)
```

**Usage:** Cautions, important notices, medium-priority alerts

#### Danger/Error (Red)
```css
--color-danger: #ef4444
--color-danger-dark: #dc2626
--color-danger-light: #f87171
--color-danger-bg: rgba(239, 68, 68, 0.1)
```

**Usage:** Errors, destructive actions, critical alerts

#### Info (Blue)
```css
--color-info: #3b82f6
--color-info-dark: #2563eb
--color-info-light: #60a5fa
--color-info-bg: rgba(59, 130, 246, 0.1)
```

**Usage:** Informational messages, tips, general notifications

### Neutral Colors (Grays)

```css
--color-gray-50: #f9fafb   /* Lightest background */
--color-gray-100: #f3f4f6  /* Light background */
--color-gray-200: #e5e7eb  /* Borders, dividers */
--color-gray-300: #d1d5db  /* Medium borders */
--color-gray-400: #9ca3af  /* Disabled state */
--color-gray-500: #6b7280  /* Secondary text */
--color-gray-600: #4b5563  /* Body text */
--color-gray-700: #374151  /* Dark text */
--color-gray-800: #1f2937  /* Headings */
--color-gray-900: #111827  /* Darkest text */
```

### Background Colors

```css
--color-bg-primary: #ffffff     /* Main background */
--color-bg-secondary: #f8fafc   /* Subtle background */
--color-bg-tertiary: #f1f5f9    /* Card/section background */
--color-bg-dark: #1e293b        /* Dark mode (future) */
```

### Text Colors

```css
--color-text-primary: #1e293b     /* Main text */
--color-text-secondary: #475569   /* Secondary text */
--color-text-muted: #64748b       /* Muted/helper text */
--color-text-disabled: #94a3b8    /* Disabled elements */
--color-text-inverse: #ffffff     /* Text on dark backgrounds */
```

### Border Colors

```css
--color-border-light: #f1f5f9   /* Subtle borders */
--color-border: #e2e8f0         /* Standard borders */
--color-border-medium: #cbd5e1  /* Medium emphasis */
--color-border-dark: #94a3b8    /* Strong borders */
```

### Color Usage Examples

```html
<!-- Primary Button -->
<button style="background: var(--color-primary); color: var(--color-text-inverse);">
  Save Resume
</button>

<!-- Success Alert -->
<div style="background: var(--color-success-bg); border: 1px solid var(--color-success);">
  Resume saved successfully!
</div>

<!-- Text Hierarchy -->
<h1 style="color: var(--color-text-primary);">Main Heading</h1>
<p style="color: var(--color-text-secondary);">Body text</p>
<small style="color: var(--color-text-muted);">Helper text</small>
```

---

## Typography

### Font Families

```css
--font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace
```

**Usage:**
- Use `--font-family-primary` for all UI text
- Use `--font-family-mono` for code snippets only

### Font Sizes (8px Scale)

```css
--font-size-xs: 0.75rem      /* 12px - Fine print, labels */
--font-size-sm: 0.875rem     /* 14px - Small text, captions */
--font-size-base: 1rem       /* 16px - Body text (default) */
--font-size-lg: 1.125rem     /* 18px - Large body text */
--font-size-xl: 1.25rem      /* 20px - Subheadings */
--font-size-2xl: 1.5rem      /* 24px - H3 */
--font-size-3xl: 1.875rem    /* 30px - H2 */
--font-size-4xl: 2.25rem     /* 36px - H1 (sections) */
--font-size-5xl: 3rem        /* 48px - H1 (page hero) */
```

### Font Weights

```css
--font-weight-normal: 400    /* Body text */
--font-weight-medium: 500    /* Emphasis */
--font-weight-semibold: 600  /* Subheadings, buttons */
--font-weight-bold: 700      /* Headings */
```

### Line Heights

```css
--line-height-tight: 1.25    /* Headings */
--line-height-normal: 1.5    /* Body text (default) */
--line-height-relaxed: 1.6   /* Long-form content */
--line-height-loose: 1.8     /* Spacious content */
```

### Letter Spacing

```css
--letter-spacing-tight: -0.025em   /* Large headings */
--letter-spacing-normal: 0         /* Body text (default) */
--letter-spacing-wide: 0.025em     /* Small text */
--letter-spacing-wider: 0.05em     /* All-caps labels */
```

### Typography Scale Usage

```html
<!-- Page Hero -->
<h1 style="
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
">ResuMate</h1>

<!-- Section Heading -->
<h2 style="
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-4);
">Resume Builder</h2>

<!-- Body Text -->
<p style="
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
">Build your professional resume in minutes.</p>

<!-- Small Text -->
<small style="
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
">Last saved: 2 minutes ago</small>
```

---

## Spacing System

ResuMate uses an **8px grid system** for all spacing to ensure visual consistency and rhythm.

### Spacing Scale

```css
--spacing-0: 0
--spacing-1: 0.25rem    /* 4px - Tight spacing */
--spacing-2: 0.5rem     /* 8px - Standard gap */
--spacing-3: 0.75rem    /* 12px - Small margin */
--spacing-4: 1rem       /* 16px - Base unit */
--spacing-5: 1.25rem    /* 20px - Medium */
--spacing-6: 1.5rem     /* 24px - Large */
--spacing-8: 2rem       /* 32px - XL */
--spacing-10: 2.5rem    /* 40px - XXL */
--spacing-12: 3rem      /* 48px - Section spacing */
--spacing-16: 4rem      /* 64px - Large sections */
--spacing-20: 5rem      /* 80px - Hero spacing */
--spacing-24: 6rem      /* 96px - Page sections */
```

### Spacing Usage Guidelines

**Margins:**
- Between sections: `var(--spacing-12)` or `var(--spacing-16)`
- Between components: `var(--spacing-6)` or `var(--spacing-8)`
- Between elements: `var(--spacing-4)`
- Between related items: `var(--spacing-2)` or `var(--spacing-3)`

**Padding:**
- Cards/containers: `var(--spacing-6)` or `var(--spacing-8)`
- Buttons: `var(--spacing-2) var(--spacing-4)` (vertical horizontal)
- Form inputs: `var(--spacing-3) var(--spacing-4)`
- Small elements: `var(--spacing-2)`

**Gaps (Flexbox/Grid):**
- Between items in a list: `var(--spacing-2)` or `var(--spacing-3)`
- Between form fields: `var(--spacing-4)`
- Between cards: `var(--spacing-4)` or `var(--spacing-6)`

```css
/* Example: Card Component */
.card {
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
  gap: var(--spacing-4);
}

/* Example: Button */
.btn {
  padding: var(--spacing-2) var(--spacing-4);
  margin-right: var(--spacing-2);
}

/* Example: Section */
.section {
  padding: var(--spacing-12) 0;
  margin-bottom: var(--spacing-8);
}
```

---

## Components

### Buttons

#### Primary Button

```html
<button class="btn-primary">
  Save Resume
</button>
```

```css
.btn-primary {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-inverse);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-button);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring-offset-shadow);
}
```

#### Button Sizes

```css
/* Small */
--btn-height-sm: 2rem;      /* 32px */
padding: var(--spacing-1) var(--spacing-3);
font-size: var(--font-size-xs);

/* Base (default) */
--btn-height-base: 2.5rem;  /* 40px */
padding: var(--spacing-2) var(--spacing-4);
font-size: var(--font-size-sm);

/* Large */
--btn-height-lg: 3rem;      /* 48px */
padding: var(--spacing-3) var(--spacing-6);
font-size: var(--font-size-base);
```

#### Button Variants

- **Primary:** Main actions (Save, Submit, Continue)
- **Secondary:** Alternative actions (Cancel, Back)
- **Success:** Positive actions (Approve, Confirm)
- **Danger:** Destructive actions (Delete, Remove)
- **Ghost:** Tertiary actions (Link-style buttons)

### Cards

```html
<div class="card">
  <h3 class="card-title">Card Title</h3>
  <p class="card-text">Card content goes here.</p>
</div>
```

```css
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-card);
  transition: var(--transition-all);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Form Inputs

```html
<input type="text" class="form-input" placeholder="Enter text...">
<textarea class="form-textarea" rows="4"></textarea>
```

```css
.form-input,
.form-textarea {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  transition: var(--transition-colors);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-bg);
}
```

### Badges

```html
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Error</span>
<span class="badge badge-info">Info</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.badge-success {
  background: var(--color-success-bg);
  color: var(--color-success-dark);
}
```

---

## Layout Guidelines

### Container Widths

```css
--container-sm: 24rem;      /* 384px */
--container-md: 28rem;      /* 448px */
--container-lg: 32rem;      /* 512px */
--container-xl: 36rem;      /* 576px */
--container-2xl: 42rem;     /* 672px */
--container-3xl: 48rem;     /* 768px */
--container-4xl: 56rem;     /* 896px */
--container-5xl: 64rem;     /* 1024px */
--container-6xl: 72rem;     /* 1152px */
--container-7xl: 80rem;     /* 1280px - Standard page width */
```

**Usage:**
- Most pages: `max-width: var(--container-7xl)`
- Narrow content: `max-width: var(--container-4xl)`
- Modals/forms: `max-width: var(--container-2xl)`

### Grid System

Use CSS Grid or Flexbox for layouts. Prefer Grid for two-dimensional layouts.

```css
/* Two-column layout */
.grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
}

/* Three-column layout */
.grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6);
}

/* Responsive grid */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}
```

---

## Accessibility

### WCAG AA Compliance (Minimum)

1. **Color Contrast**
   - Normal text: 4.5:1 minimum
   - Large text (18px+): 3:1 minimum
   - UI components: 3:1 minimum

2. **Focus Indicators**
   ```css
   :focus-visible {
     outline: 2px solid var(--focus-ring-color);
     outline-offset: 2px;
   }
   ```

3. **ARIA Labels**
   - All interactive elements must have accessible labels
   - Use `aria-label`, `aria-labelledby`, or `aria-describedby`
   - Provide `role` attributes where semantic HTML isn't sufficient

4. **Keyboard Navigation**
   - All functionality accessible via keyboard
   - Logical tab order
   - Skip to main content link

5. **Screen Reader Support**
   - Semantic HTML (use `<nav>`, `<main>`, `<article>`, etc.)
   - Alt text for images
   - ARIA live regions for dynamic content

### Accessibility Checklist

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Interactive elements have focus states
- [ ] Color is not the only indicator
- [ ] Content is readable at 200% zoom
- [ ] Keyboard navigation works
- [ ] Screen reader tested

---

## Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px    /* Small devices (landscape phones) */
--breakpoint-md: 768px    /* Medium devices (tablets) */
--breakpoint-lg: 1024px   /* Large devices (desktops) */
--breakpoint-xl: 1280px   /* Extra large devices */
--breakpoint-2xl: 1536px  /* Ultra-wide displays */
```

### Mobile-First Approach

Write CSS for mobile first, then enhance for larger screens:

```css
/* Mobile (default) */
.container {
  padding: var(--spacing-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-6);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-8);
  }
}
```

### Touch Targets

Minimum touch target size: **44x44px** (WCAG AAA)

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

---

## Code Standards

### CSS Best Practices

1. **Use CSS Variables**
   ```css
   /* Good */
   color: var(--color-primary);

   /* Bad */
   color: #6366f1;
   ```

2. **BEM Naming Convention**
   ```css
   .block {}
   .block__element {}
   .block--modifier {}
   ```

3. **Avoid Deep Nesting**
   ```css
   /* Good */
   .card-title {}

   /* Bad */
   .card .inner .content .title {}
   ```

4. **Use Shorthand Properties**
   ```css
   /* Good */
   margin: var(--spacing-4) 0;

   /* Bad */
   margin-top: var(--spacing-4);
   margin-bottom: var(--spacing-4);
   ```

### HTML Best Practices

1. **Semantic HTML**
   - Use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
   - Use `<button>` for actions, `<a>` for navigation

2. **Accessibility Attributes**
   ```html
   <button aria-label="Close dialog">×</button>
   <nav aria-label="Main navigation">...</nav>
   ```

3. **Valid HTML**
   - Close all tags
   - Use lowercase for tags and attributes
   - Quote all attribute values

---

## Quick Reference

### Common Patterns

```css
/* Card with hover effect */
.card {
  background: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: var(--transition-all);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Primary button */
.btn-primary {
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

/* Form input */
.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-bg);
}
```

---

## Resources

- **Design Tokens:** `/css/variables.css`
- **Navigation System:** `/css/navigation.css`
- **Notifications:** `/css/notifications.css`, `/js/utils/notifications.js`
- **Component Library:** `/components/navigation.html`

---

**Maintained by:** ResuMate Development Team
**Questions?** Review the design system files or reach out to the team.

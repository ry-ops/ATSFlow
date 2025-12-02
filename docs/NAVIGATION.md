# ResuMate Navigation System Documentation

Version: 1.0.0
Last Updated: 2025-12-02

---

## 1. Overview

### Purpose

The ResuMate navigation system provides a unified, accessible, and responsive navigation experience across all pages of the application. It consolidates previously scattered navigation implementations into a single, maintainable component system.

### Key Features

- **Unified Component Architecture**: Single source of truth for navigation across all pages
- **Full WCAG 2.1 AA Compliance**: Meets accessibility standards for keyboard navigation, screen readers, and assistive technologies
- **Responsive Mobile-First Design**: Seamless experience from mobile phones to desktop displays
- **Modular JavaScript**: ES6 modules with clean separation of concerns
- **Touch-Optimized**: Minimum 44x44px touch targets, touch-friendly interactions
- **Progressive Enhancement**: Works without JavaScript, enhanced with JavaScript features
- **Performance-Optimized**: Minimal reflows, efficient event handling, smooth animations

### Benefits

- Consistent UX across all application pages
- Reduced maintenance overhead (single component to update)
- Better accessibility for users with disabilities
- Improved developer experience with clear APIs
- Easy to extend with new features
- Built-in analytics and error handling support

---

## 2. Architecture

### File Structure

```
ResuMate/
├── components/
│   └── navigation.html           # Main HTML component (include in pages)
├── css/
│   ├── variables.css              # Design system tokens
│   └── navigation.css             # Navigation styles
└── js/
    └── navigation/
        ├── index.js               # Main controller & initialization
        ├── keyboard-nav.js        # Keyboard navigation handler
        ├── mobile-menu.js         # Mobile menu controller
        └── focus-trap.js          # Focus management utility
```

### Component Structure Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    navigation.html                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Skip to Main Content Link (accessibility)             │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  <nav class="resumate-navbar">                         │ │
│  │    ┌──────────┬────────────────────┬────────────────┐ │ │
│  │    │  Brand   │  Navigation Items  │  Quick Actions │ │ │
│  │    │  Logo +  │  - Build (dropdown)│  + New Resume  │ │ │
│  │    │  Title   │  - AI Tools (drop) │                │ │ │
│  │    │          │  - Optimize (drop) │                │ │ │
│  │    │ [Mobile  │  - Export (drop)   │                │ │ │
│  │    │  Toggle] │  - Analytics       │                │ │ │
│  │    └──────────┴────────────────────┴────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Mobile Menu Overlay (backdrop)                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Feature Shortcuts (floating quick access menu)        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

JavaScript Module Architecture:
┌────────────────────────────────────────────────────┐
│  index.js (Navigation Controller)                  │
│  ├─ Component Loading (fetch & inject HTML)        │
│  ├─ Active Page Detection                          │
│  ├─ Dropdown Menu Management                       │
│  └─ Shortcuts Menu Management                      │
│     ↓ delegates to                                 │
│  ├─ keyboard-nav.js (KeyboardNavigation)          │
│  │  └─ ARIA menu pattern implementation            │
│  └─ mobile-menu.js (MobileMenu)                   │
│     └─ Touch interactions, focus trap, scroll lock│
└────────────────────────────────────────────────────┘
```

### Component Relationships

**HTML Component** (`navigation.html`)
- Self-contained markup with semantic HTML5
- Includes inline fallback script for progressive enhancement
- References modular JS via `<script type="module">`

**CSS Styles** (`navigation.css`)
- Consumes design tokens from `variables.css`
- Mobile-first responsive breakpoints
- Accessibility-specific styles (focus rings, reduced motion, high contrast)

**JavaScript Modules**
- `index.js`: Orchestration, initialization, component loading
- `keyboard-nav.js`: Implements ARIA menu keyboard patterns
- `mobile-menu.js`: Mobile-specific interactions, scroll locking, focus trapping
- `focus-trap.js`: Utility for accessible focus management

### Module Dependencies

```
index.js
  ├── imports: keyboard-nav.js
  │   └── exports: KeyboardNavigation class, initKeyboardNav()
  └── imports: mobile-menu.js
      ├── imports: focus-trap.js
      │   └── exports: createFocusTrap()
      └── exports: MobileMenu class, initMobileMenu()
```

**Dependency Chain**:
1. `variables.css` (design tokens)
2. `navigation.css` (component styles)
3. `focus-trap.js` (utility)
4. `keyboard-nav.js` (feature module)
5. `mobile-menu.js` (feature module, depends on focus-trap)
6. `index.js` (main controller, depends on keyboard-nav and mobile-menu)
7. `navigation.html` (component, references all above)

---

## 3. Responsive Design

### Breakpoint System

Defined in `variables.css`:

| Breakpoint | Value | Usage |
|------------|-------|-------|
| `--breakpoint-sm` | 640px | Small tablets |
| `--breakpoint-md` | 768px | Tablets (mobile menu breakpoint) |
| `--breakpoint-lg` | 1024px | Desktop |
| `--breakpoint-xl` | 1280px | Large desktop |
| `--breakpoint-2xl` | 1536px | Extra large desktop |

### Mobile-First Approach

The navigation is designed mobile-first, with desktop features progressively enhanced:

**Base Styles (Mobile)**:
- Stacked vertical layout for mobile menu
- Hamburger menu toggle button
- Full-screen overlay menu
- Touch-optimized tap targets (44x44px minimum)
- Bottom-anchored action buttons

**Desktop Enhancements** (>= 768px):
- Horizontal navigation bar
- Hover-activated dropdown menus
- Inline quick actions
- Enhanced keyboard navigation
- Sticky header behavior

### Navigation Behavior at Each Viewport

#### Mobile (< 768px)

**Closed State**:
- Hamburger icon (☰) visible in top-right
- Brand logo and title visible
- Navigation items hidden
- Quick actions hidden

**Open State**:
- Full-screen overlay menu slides in from left
- Navigation items stacked vertically
- Dropdowns expand inline (no hover)
- Close button (✕) visible
- Body scroll locked
- Quick actions fixed at bottom
- Focus trapped within menu

**Interactions**:
- Tap hamburger to open
- Tap close button or overlay to close
- Escape key closes menu
- Dropdowns expand on tap (no submenu hover)
- Swipe gestures (future enhancement)

#### Tablet (768px - 1023px)

- Horizontal navigation bar
- Dropdowns appear on hover or tap
- Mobile toggle hidden
- Full navigation visible
- Responsive spacing adjustments

#### Desktop (>= 1024px)

- Full horizontal layout
- Hover-activated dropdowns with animations
- Keyboard navigation fully active
- Enhanced focus indicators
- Sticky header at top
- Feature shortcuts floating bottom-right

### Touch-Friendly Considerations

#### Minimum Touch Targets

All interactive elements meet WCAG 2.5.5 (Target Size) AA standard:

```css
.nav-link,
.nav-dropdown-toggle,
.shortcuts-link,
.breadcrumb-link {
  min-height: 44px; /* Minimum touch target height */
}

.navbar-toggle,
.shortcuts-toggle {
  min-width: 44px;  /* Minimum touch target width */
  min-height: 44px;
}
```

#### Touch Interaction Patterns

- **Tap Areas**: Generous padding around links (min 44x44px)
- **Spacing**: Adequate gaps between targets (8px minimum)
- **Visual Feedback**: Active states on touch (`:active` pseudo-class)
- **No Hover Dependencies**: All functionality accessible via tap
- **Swipe Tolerance**: Future support for swipe-to-close gestures

#### Mobile-Specific Features

- **Scroll Lock**: Prevents body scrolling when menu open
- **Focus Trap**: Keyboard focus contained within mobile menu
- **Overlay Dismiss**: Tap outside menu to close
- **Smooth Animations**: 300ms transitions for open/close
- **Position Memory**: Restores scroll position after menu closes

---

## 4. Accessibility (WCAG 2.1 AA)

### Semantic HTML Structure

The navigation uses semantic HTML5 elements and ARIA attributes:

```html
<!-- Skip link for keyboard users -->
<a href="#main-content" class="skip-to-main">Skip to main content</a>

<!-- Main navigation with role -->
<nav role="navigation" aria-label="Main navigation">

  <!-- Menu bar with ARIA role -->
  <ul role="menubar" aria-label="Main navigation menu">

    <!-- Dropdown menu item -->
    <li class="nav-dropdown" role="none">
      <button
        role="menuitem"
        aria-haspopup="true"
        aria-expanded="false"
        class="nav-dropdown-toggle">
        Build
      </button>

      <!-- Submenu -->
      <ul role="menu" aria-label="Build submenu">
        <li role="none">
          <a role="menuitem" href="/builder.html">
            Visual Builder
          </a>
        </li>
      </ul>
    </li>
  </ul>
</nav>

<!-- Live region for screen reader announcements -->
<div
  id="nav-announcements"
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only">
</div>
```

**Key Semantic Elements**:
- `<nav>` with `role="navigation"`
- `role="menubar"` for top-level menu
- `role="menu"` for dropdown submenus
- `role="menuitem"` for interactive items
- `role="none"` to remove list semantics where ARIA roles override
- `aria-label` for descriptive labels
- `aria-current="page"` for active page links

### Keyboard Navigation Guide

The navigation implements the ARIA Authoring Practices Guide (APG) menu pattern.

#### Global Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `Tab` | Move to next focusable element | Anywhere |
| `Shift+Tab` | Move to previous focusable element | Anywhere |
| `Escape` | Close open dropdown/mobile menu | Menu open |

#### Top-Level Menu Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` | Move focus to next menu item |
| `ArrowLeft` | Move focus to previous menu item |
| `ArrowDown` | Open dropdown (if focused item has dropdown) |
| `ArrowUp` | Close current dropdown |
| `Home` | Move focus to first menu item |
| `End` | Move focus to last menu item |
| `Enter` / `Space` | Activate focused item (open dropdown or follow link) |

#### Dropdown Menu Navigation

When a dropdown is open:

| Key | Action |
|-----|--------|
| `ArrowDown` | Move focus to next item in dropdown |
| `ArrowUp` | Move focus to previous item in dropdown |
| `Home` | Move focus to first item in dropdown |
| `End` | Move focus to last item in dropdown |
| `Escape` | Close dropdown, return focus to toggle button |
| `Tab` | Close dropdown, move focus to next top-level item |
| `Enter` | Activate focused link |

#### Mobile Menu

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Navigate within menu (focus trapped) |
| `Escape` | Close mobile menu |
| `Enter` / `Space` | Activate focused item |

#### Feature Shortcuts Menu

| Key | Action |
|-----|--------|
| `Escape` | Close shortcuts menu |
| `Tab` | Navigate shortcuts |

### ARIA Attributes Used

**State Attributes**:
- `aria-expanded="true|false"`: Indicates dropdown/menu open state
- `aria-hidden="true|false"`: Hides elements from screen readers
- `aria-current="page"`: Marks current page link

**Property Attributes**:
- `aria-label="..."`: Provides accessible labels
- `aria-haspopup="true"`: Indicates element triggers popup
- `aria-controls="id"`: Associates button with controlled element
- `aria-atomic="true"`: Announces entire live region content

**Relationship Attributes**:
- `role="navigation"`: Identifies navigation landmark
- `role="menubar"`: Horizontal menu container
- `role="menu"`: Vertical menu container (dropdowns)
- `role="menuitem"`: Interactive menu item
- `role="none"`: Removes default list semantics
- `role="status"`: Live region for announcements

### Focus Management

#### Focus Indicators

High-contrast focus rings meeting WCAG 2.4.7 (Focus Visible):

```css
:root {
  --focus-ring-color: var(--color-primary);
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
}

/* Visible keyboard focus indicator (3:1 contrast minimum) */
.nav-link:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
```

**Focus Indicator Features**:
- 3px solid outline (visible at 3:1 contrast)
- 2px offset from element edge
- Additional shadow for enhanced visibility
- Uses `:focus-visible` to show only for keyboard
- Different styles for buttons on colored backgrounds

#### Focus Trap (Mobile Menu)

When mobile menu opens:
1. Focus moves to first interactive element in menu
2. Tab/Shift+Tab cycles only within menu
3. Escape closes menu and returns focus to toggle button
4. Prevents focus from leaving menu while open

Implementation: `focus-trap.js` module

#### Focus Restoration

After closing menus:
- Focus returns to the element that triggered the menu
- Scroll position is preserved (mobile menu)
- Announced to screen readers ("Menu closed")

### Screen Reader Support

#### Announcements

Dynamic changes are announced via ARIA live regions:

```javascript
// Announces to screen readers when menus open/close
announce(message) {
  const liveRegion = document.getElementById('nav-announcements');
  liveRegion.textContent = message;
  // Examples: "Build submenu opened", "Mobile menu closed"
}
```

**Announcement Triggers**:
- Dropdown menu opened: "Build submenu opened"
- Mobile menu opened: "Mobile menu opened"
- Mobile menu closed: "Mobile menu closed"
- Active page detected: Sets `aria-current="page"`

#### Screen Reader Navigation

**Landmarks**:
- Navigation landmark (`<nav>` element)
- Skip link to main content
- Proper heading structure

**Content Order**:
1. Skip link (invisible until focused)
2. Brand/logo
3. Navigation menu items
4. Quick actions
5. Feature shortcuts (optional)

**Alternative Text**:
- Icons have `aria-hidden="true"` (decorative)
- Text labels always present for meaningful content
- `aria-label` attributes on menus

### Skip Links

```html
<a href="#main-content" class="skip-to-main">
  Skip to main content
</a>
```

**Features**:
- Positioned off-screen by default
- Becomes visible on focus (keyboard only)
- High contrast styling (WCAG AAA)
- Enhanced focus ring (3:1 contrast)
- Links to `id="main-content"` on page

**Usage**: Add to each page:
```html
<main id="main-content" tabindex="-1">
  <!-- Page content -->
</main>
```

### Reduced Motion Support

Respects user's motion preferences (WCAG 2.3.3 Animation from Interactions):

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* No transform animations */
  .nav-dropdown-menu,
  .shortcuts-menu {
    transition: opacity 0.01ms, visibility 0.01ms;
    transform: none !important;
  }
}
```

**Affected Animations**:
- Dropdown slide/fade transitions
- Mobile menu slide-in animation
- Hover state transforms
- Shortcuts menu animations

### High Contrast Mode Support

Enhanced visibility for high contrast mode (WCAG 1.4.11 Non-text Contrast):

```css
@media (prefers-contrast: more) {
  /* Enhanced borders for interactive elements */
  .nav-link,
  .nav-dropdown-link {
    border: 2px solid transparent;
  }

  .nav-link:hover,
  .nav-link.active {
    border-color: var(--color-primary);
  }

  /* Thicker focus indicators */
  .nav-link:focus-visible {
    outline-width: 4px;
    outline-offset: 3px;
  }

  /* Visible dividers */
  .nav-dropdown-divider {
    border-width: 2px;
  }
}
```

**High Contrast Features**:
- 2px borders on interactive elements
- Borders become visible on hover/active
- 4px outline width for focus
- Enhanced divider visibility
- Increased contrast ratios

---

## 5. Usage Guide

### How to Add Navigation to a New Page

#### Step 1: Include CSS Files

Add to `<head>` section:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page - ResuMate</title>

  <!-- Design system variables (required first) -->
  <link rel="stylesheet" href="/css/variables.css">

  <!-- Navigation styles -->
  <link rel="stylesheet" href="/css/navigation.css">

  <!-- Your page-specific styles -->
  <link rel="stylesheet" href="/css/your-page.css">
</head>
```

#### Step 2: Add Main Content Container

Ensure your main content has proper landmark and ID:

```html
<body>
  <!-- Navigation will be injected here by JavaScript -->

  <!-- Main content with skip link target -->
  <main id="main-content" tabindex="-1">
    <h1>Your Page Title</h1>
    <!-- Your content -->
  </main>
</body>
```

**Important**:
- Use `id="main-content"` for skip link target
- Add `tabindex="-1"` to allow programmatic focus

#### Step 3: Initialize Navigation with JavaScript

**Option A: Auto-Initialize (Recommended)**

Add before closing `</body>` tag:

```html
<!-- Auto-initialize navigation -->
<script type="module">
  import { autoInit } from '/js/navigation/index.js';
  autoInit();
</script>
```

**Option B: Manual Initialization with Options**

```html
<script type="module">
  import { initNavigation } from '/js/navigation/index.js';

  // Initialize with custom options
  const nav = await initNavigation({
    componentPath: '/components/navigation.html',
    mountSelector: 'body',
    onLoad: (navigation) => {
      console.log('Navigation loaded successfully');
    },
    onError: (error) => {
      console.error('Navigation failed to load:', error);
      // Fallback handling
    }
  });
</script>
```

**Option C: Using Navigation Class**

For more control:

```html
<script type="module">
  import { Navigation } from '/js/navigation/index.js';

  const navigation = new Navigation({
    componentPath: '/components/navigation.html',
    onLoad: () => {
      console.log('Navigation ready');
      // Custom post-load logic
    }
  });

  await navigation.init();
</script>
```

#### Step 4: Add Breadcrumbs (Optional)

For pages that need contextual navigation:

```html
<nav class="breadcrumbs" aria-label="Breadcrumb navigation">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item">
      <a href="/index.html" class="breadcrumb-link">Home</a>
    </li>
    <li class="breadcrumb-separator" aria-hidden="true">/</li>
    <li class="breadcrumb-item">
      <a href="/builder.html" class="breadcrumb-link">Builder</a>
    </li>
    <li class="breadcrumb-separator" aria-hidden="true">/</li>
    <li class="breadcrumb-item">
      <span class="breadcrumb-current" aria-current="page">
        Current Page
      </span>
    </li>
  </ol>
</nav>
```

### Customization Options

#### Navigation Class Options

```javascript
const options = {
  // Path to navigation HTML component
  componentPath: '/components/navigation.html',

  // CSS selector for mount point (default: 'body')
  mountSelector: 'body',

  // Callback after successful load
  onLoad: (navigationInstance) => {
    console.log('Navigation loaded');
  },

  // Callback on error
  onError: (error) => {
    console.error('Navigation error:', error);
  }
};
```

#### Mobile Menu Options

```javascript
import { MobileMenu } from '/js/navigation/mobile-menu.js';

const mobileMenu = new MobileMenu(navElement, {
  // Animation duration in milliseconds
  animationDuration: 300,

  // Callback when menu opens
  onOpen: () => {
    console.log('Mobile menu opened');
    // Track analytics, etc.
  },

  // Callback when menu closes
  onClose: () => {
    console.log('Mobile menu closed');
  }
});
```

#### Customizing Navigation Items

Edit `/components/navigation.html`:

```html
<!-- Add new top-level link -->
<li class="nav-item" role="none">
  <a href="/new-feature.html" class="nav-link" role="menuitem">
    <span class="nav-link-icon" aria-hidden="true">🎯</span>
    <span>New Feature</span>
  </a>
</li>

<!-- Add new dropdown -->
<li class="nav-item nav-dropdown" role="none">
  <button class="nav-dropdown-toggle" type="button"
          aria-haspopup="true" aria-expanded="false" role="menuitem">
    <span class="nav-link-icon" aria-hidden="true">📚</span>
    <span>Resources</span>
    <span aria-hidden="true">▾</span>
  </button>
  <ul class="nav-dropdown-menu" role="menu" aria-label="Resources submenu">
    <li class="nav-dropdown-item" role="none">
      <a href="/docs.html" class="nav-dropdown-link" role="menuitem">
        <span aria-hidden="true">📖</span>
        Documentation
      </a>
    </li>
  </ul>
</li>
```

#### Styling Customization

Override CSS variables in your page-specific stylesheet:

```css
/* Custom navigation colors */
:root {
  --color-primary: #your-color;
  --color-primary-dark: #your-darker-color;
  --color-primary-bg: rgba(your-color, 0.1);
}

/* Custom navigation height */
.resumate-navbar {
  --navbar-height: 80px;
}

/* Custom dropdown styling */
.nav-dropdown-menu {
  min-width: 250px; /* Wider dropdowns */
  border-radius: var(--radius-lg);
}
```

### API Reference for JavaScript Modules

#### Navigation Class

**Constructor**
```javascript
new Navigation(options)
```
- `options.componentPath` (string): Path to navigation.html
- `options.mountSelector` (string): Where to mount navigation
- `options.onLoad` (function): Callback after load
- `options.onError` (function): Error callback

**Methods**
```javascript
// Initialize navigation
await navigation.init()

// Update active page highlighting
navigation.updateActivePage('/new-page.html')

// Get mobile menu instance
const mobileMenu = navigation.getMobileMenu()

// Get keyboard navigation instance
const keyboardNav = navigation.getKeyboardNav()

// Destroy navigation and clean up
navigation.destroy()
```

**Properties**
```javascript
navigation.navElement      // HTMLElement: nav element
navigation.isInitialized   // boolean: initialization state
navigation.keyboardNav     // KeyboardNavigation instance
navigation.mobileMenu      // MobileMenu instance
```

#### KeyboardNavigation Class

**Constructor**
```javascript
new KeyboardNavigation(navElement)
```

**Methods**
```javascript
// Initialize keyboard navigation
keyboardNav.init()

// Navigation methods (called by keyboard events)
keyboardNav.navigateRight()
keyboardNav.navigateLeft()
keyboardNav.navigateToFirst()
keyboardNav.navigateToLast()

// Dropdown control
keyboardNav.openCurrentDropdown()
keyboardNav.closeCurrentDropdown()
keyboardNav.closeAllDropdowns()

// Clean up
keyboardNav.destroy()
```

#### MobileMenu Class

**Constructor**
```javascript
new MobileMenu(navElement, options)
```

**Methods**
```javascript
// Initialize mobile menu
mobileMenu.init()

// Control menu state
mobileMenu.open()
mobileMenu.close()
mobileMenu.toggle()

// Check state
const isOpen = mobileMenu.isMenuOpen()

// Clean up
mobileMenu.destroy()
```

**Events**
```javascript
// Via options callbacks
{
  onOpen: () => { /* menu opened */ },
  onClose: () => { /* menu closed */ }
}
```

#### Utility Functions

```javascript
// Auto-initialize navigation on page load
import { autoInit } from '/js/navigation/index.js';
autoInit();

// Initialize with Promise
import { initNavigation } from '/js/navigation/index.js';
const nav = await initNavigation(options);

// Initialize specific modules
import { initKeyboardNav } from '/js/navigation/keyboard-nav.js';
const keyboardNav = initKeyboardNav(navElement);

import { initMobileMenu } from '/js/navigation/mobile-menu.js';
const mobileMenu = initMobileMenu(navElement, options);
```

---

## 6. Testing Checklist

### Manual Testing Steps

#### Desktop Testing (>= 768px)

- [ ] **Visual Inspection**
  - [ ] Navigation bar appears at top of page
  - [ ] Brand logo and title visible
  - [ ] All menu items visible horizontally
  - [ ] Quick action button visible
  - [ ] Feature shortcuts button visible (bottom-right)

- [ ] **Hover Interactions**
  - [ ] Hovering menu items shows hover state
  - [ ] Hovering dropdown toggle shows dropdown menu
  - [ ] Dropdown menus have smooth animation
  - [ ] Dropdown closes when hovering away

- [ ] **Click Interactions**
  - [ ] Clicking dropdown toggle opens/closes menu
  - [ ] Clicking dropdown item navigates to page
  - [ ] Clicking outside dropdown closes it
  - [ ] Quick action button works
  - [ ] Feature shortcuts toggle opens/closes menu

- [ ] **Active Page Detection**
  - [ ] Current page link has active styling
  - [ ] Parent dropdown of active page is marked active

#### Mobile Testing (< 768px)

- [ ] **Visual Inspection**
  - [ ] Hamburger menu icon visible (top-right)
  - [ ] Brand logo and title visible
  - [ ] Navigation items hidden when closed
  - [ ] Mobile menu slides in from left when opened

- [ ] **Mobile Menu Open**
  - [ ] Menu slides in smoothly (300ms)
  - [ ] Full-screen overlay appears
  - [ ] Close button (✕) visible in menu
  - [ ] Navigation items stacked vertically
  - [ ] Body scroll is locked
  - [ ] Quick actions visible at bottom

- [ ] **Mobile Menu Close**
  - [ ] Tapping close button closes menu
  - [ ] Tapping overlay closes menu
  - [ ] Menu slides out smoothly
  - [ ] Body scroll is restored
  - [ ] Scroll position is preserved

- [ ] **Touch Interactions**
  - [ ] All touch targets are 44x44px minimum
  - [ ] Adequate spacing between targets
  - [ ] Touch feedback on tap (visual highlight)
  - [ ] Dropdowns expand inline on tap

#### Keyboard Navigation Testing

- [ ] **Skip Link**
  - [ ] Tab from URL bar focuses skip link
  - [ ] Skip link becomes visible when focused
  - [ ] Pressing Enter skips to main content
  - [ ] Main content receives focus

- [ ] **Top-Level Navigation**
  - [ ] Tab key moves through menu items
  - [ ] Arrow Right/Left navigate horizontally
  - [ ] Home/End keys go to first/last item
  - [ ] Arrow Down opens dropdown menu
  - [ ] Enter/Space activates focused item
  - [ ] Focus indicators are clearly visible

- [ ] **Dropdown Navigation**
  - [ ] Arrow Down/Up navigate dropdown items
  - [ ] Home/End go to first/last dropdown item
  - [ ] Escape closes dropdown, returns focus to toggle
  - [ ] Tab closes dropdown, moves to next menu item
  - [ ] Enter activates dropdown link

- [ ] **Mobile Menu Keyboard**
  - [ ] Tab navigates within open menu (focus trapped)
  - [ ] Shift+Tab navigates backward
  - [ ] Escape closes mobile menu
  - [ ] Focus returns to hamburger button when closed

#### Screen Reader Testing

Test with at least one screen reader (NVDA, JAWS, VoiceOver):

- [ ] **Landmarks**
  - [ ] Navigation landmark announced
  - [ ] Main content landmark announced
  - [ ] Landmark navigation works (VoiceOver: VO+U+L)

- [ ] **Menu Structure**
  - [ ] Menu bar announced correctly
  - [ ] Menu items announced with role
  - [ ] Dropdown state announced (collapsed/expanded)
  - [ ] Current page announced (aria-current)

- [ ] **Live Regions**
  - [ ] Opening dropdown announces "submenu opened"
  - [ ] Opening mobile menu announces "Mobile menu opened"
  - [ ] Closing menus announced

- [ ] **Navigation**
  - [ ] Can navigate through all links
  - [ ] Dropdown items accessible
  - [ ] No focus trapped unexpectedly
  - [ ] All functionality available without mouse

#### Responsive Testing

Test at these viewport widths:

- [ ] **320px** (iPhone SE)
  - [ ] Navigation doesn't overflow
  - [ ] Text is readable
  - [ ] Touch targets are adequate

- [ ] **375px** (iPhone 12)
  - [ ] Layout appears correct

- [ ] **768px** (Tablet)
  - [ ] Transitions to desktop layout
  - [ ] Mobile toggle hidden

- [ ] **1024px** (Desktop)
  - [ ] Full desktop layout

- [ ] **1920px** (Large Desktop)
  - [ ] Navigation doesn't stretch too wide
  - [ ] Content centered appropriately

#### Browser Compatibility

Test in these browsers:

- [ ] **Chrome** (latest)
  - [ ] All features work
  - [ ] Animations smooth
  - [ ] Focus indicators visible

- [ ] **Firefox** (latest)
  - [ ] All features work
  - [ ] Keyboard navigation works

- [ ] **Safari** (latest)
  - [ ] All features work
  - [ ] Mobile Safari (iOS)

- [ ] **Edge** (latest)
  - [ ] All features work

- [ ] **Samsung Internet** (Android)
  - [ ] Mobile functionality works

### Accessibility Testing Tools

#### Automated Testing

**axe DevTools**
```javascript
// Install: https://www.deque.com/axe/devtools/
// Run in browser DevTools

// Check for violations
axe.run().then(results => {
  console.log(results.violations);
});
```

- [ ] Run axe DevTools on page with navigation
- [ ] Fix all critical and serious violations
- [ ] Document any moderate violations with justification

**WAVE Extension**
- [ ] Install WAVE browser extension
- [ ] Run on page with navigation
- [ ] Review errors and alerts
- [ ] Fix all errors
- [ ] Document any unavoidable alerts

**Lighthouse**
```bash
# Run Lighthouse audit
lighthouse https://your-page.com --view
```

- [ ] Accessibility score >= 95
- [ ] No accessibility errors in report
- [ ] Best practices score >= 90

#### Manual Accessibility Testing

**Keyboard-Only Navigation**
- [ ] Unplug mouse/disable trackpad
- [ ] Navigate entire site using only keyboard
- [ ] All functionality accessible
- [ ] Focus always visible
- [ ] No keyboard traps

**Screen Reader Testing**

**Windows (NVDA - Free)**
```
Download: https://www.nvaccess.org/download/
Basic commands:
- Insert+Down: Start reading
- Tab: Next focusable element
- Insert+F7: Elements list
- Insert+Ctrl+L: Landmarks list
```

**macOS (VoiceOver - Built-in)**
```
Enable: Cmd+F5
Basic commands:
- VO+A: Start reading (VO = Ctrl+Option)
- VO+Right Arrow: Next item
- VO+U: Rotor (elements list)
- VO+U+L: Landmarks list
```

**Testing Checklist**:
- [ ] All text content read aloud
- [ ] Interactive elements announced correctly
- [ ] Dropdown states announced
- [ ] Active page announced
- [ ] Live regions announce changes
- [ ] No excessive verbosity

**Color Contrast**

Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

- [ ] Text on background: >= 4.5:1 (AA)
- [ ] Large text (18pt+): >= 3:1 (AA)
- [ ] Focus indicators: >= 3:1 (AA)
- [ ] Hover states have adequate contrast

**Zoom Testing**
- [ ] 200% zoom: Layout doesn't break
- [ ] 400% zoom: Content reflows (no horizontal scroll)
- [ ] Text remains readable
- [ ] No content loss

**Reduced Motion**
```css
/* Test by setting OS preference */
/* macOS: System Preferences > Accessibility > Display > Reduce motion */
/* Windows: Settings > Ease of Access > Display > Show animations */
```

- [ ] Animations respect `prefers-reduced-motion`
- [ ] No motion when preference enabled
- [ ] Functionality still works

### Browser Compatibility

#### Desktop Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full support |
| Firefox | Latest | ✅ Full support |
| Safari | Latest | ✅ Full support |
| Edge | Latest | ✅ Full support |
| Chrome | Latest - 2 | ✅ Full support |
| Firefox | Latest - 2 | ✅ Full support |

#### Mobile Browsers

| Browser | Platform | Status |
|---------|----------|--------|
| Safari | iOS 14+ | ✅ Full support |
| Chrome | Android 10+ | ✅ Full support |
| Samsung Internet | Android 10+ | ✅ Full support |
| Firefox | Android 10+ | ✅ Full support |

#### Known Issues

**None currently documented**

If issues are discovered:
1. Document in this section
2. Create GitHub issue with label "navigation"
3. Add workaround if available
4. Update tests to cover edge case

---

## Appendix

### Performance Considerations

- **Component Loading**: Async fetch with error handling
- **Event Delegation**: Efficient event handling, minimal listeners
- **Reflow Prevention**: CSS-only hover states, transform animations
- **Memory Management**: Proper cleanup on destroy
- **Bundle Size**: ~15KB minified (including all modules)

### Future Enhancements

- Dark mode support (design tokens ready)
- User preferences persistence (theme, reduced motion)
- Search functionality in navigation
- Recently visited pages
- Customizable shortcuts menu
- Swipe gestures for mobile
- Animation preferences panel

### Contributing

When modifying the navigation system:

1. Update this documentation
2. Run accessibility tests (Section 6)
3. Test in all supported browsers
4. Test at all responsive breakpoints
5. Update component version number
6. Update changelog

### Support

For questions or issues:
- Check this documentation first
- Review code comments in source files
- Check browser console for errors
- Review accessibility audit results

---

**Document Version**: 1.0.0
**Last Updated**: 2025-12-02
**Maintainer**: ResuMate Development Team

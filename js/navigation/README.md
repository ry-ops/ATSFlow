# ResuMate Navigation Module System

A comprehensive, accessible, and modular navigation system for ResuMate with WCAG 2.1 AA compliance.

## Features

- **Modular Architecture**: ES6 modules with clear separation of concerns
- **Full Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Mobile-First**: Responsive design with dedicated mobile menu handling
- **Keyboard Navigation**: Complete keyboard support with arrow keys, Home/End, Escape, etc.
- **Focus Management**: Focus trap for dropdowns and mobile menu
- **Active Page Detection**: Automatic highlighting with `aria-current="page"`
- **Body Scroll Lock**: Prevents scrolling when mobile menu is open
- **Clean API**: Simple initialization and lifecycle management

## Files

```
/js/navigation/
├── index.js           # Main controller - coordinates all features
├── keyboard-nav.js    # WCAG compliant keyboard navigation
├── mobile-menu.js     # Mobile menu with focus trap and scroll lock
├── focus-trap.js      # Reusable focus trap utility
└── README.md          # This file
```

## Installation

### Option 1: Auto-Initialize (Recommended)

Add this to your HTML pages:

```html
<script type="module">
  import { autoInit } from '/js/navigation/index.js';
  autoInit();
</script>
```

### Option 2: Manual Initialize with Options

```html
<script type="module">
  import { initNavigation } from '/js/navigation/index.js';

  // Initialize with custom options
  const nav = await initNavigation({
    componentPath: '/components/navigation.html',
    mountSelector: 'body',
    onLoad: (navInstance) => {
      console.log('Navigation loaded!', navInstance);
    },
    onError: (error) => {
      console.error('Navigation error:', error);
    }
  });
</script>
```

### Option 3: Using the Navigation Class

```javascript
import { Navigation } from '/js/navigation/index.js';

const nav = new Navigation({
  componentPath: '/components/navigation.html',
  mountSelector: 'body'
});

await nav.init();

// Access sub-modules
const mobileMenu = nav.getMobileMenu();
const keyboardNav = nav.getKeyboardNav();

// Cleanup when done
nav.destroy();
```

## Module APIs

### Navigation (index.js)

Main controller that coordinates all navigation features.

**Constructor Options:**
- `componentPath` (string): Path to navigation.html component (default: '/components/navigation.html')
- `mountSelector` (string): Selector for mount point (default: 'body')
- `onLoad` (Function): Callback after navigation loads
- `onError` (Function): Callback on error

**Methods:**
- `async init()` - Initializes navigation
- `updateActivePage(pagePath)` - Updates active page highlighting
- `getMobileMenu()` - Returns mobile menu instance
- `getKeyboardNav()` - Returns keyboard navigation instance
- `destroy()` - Cleans up and removes navigation

### KeyboardNavigation (keyboard-nav.js)

Handles all keyboard interactions following ARIA authoring practices.

**Keyboard Controls:**
- **Arrow Right/Left**: Navigate between top-level menu items
- **Arrow Down**: Open dropdown or navigate to next item in dropdown
- **Arrow Up**: Close dropdown or navigate to previous item in dropdown
- **Enter/Space**: Activate current item (click link or toggle dropdown)
- **Escape**: Close all dropdowns
- **Home**: Jump to first menu item
- **End**: Jump to last menu item
- **Tab**: Natural tab behavior (closes dropdowns)

**Methods:**
- `init()` - Initializes keyboard navigation
- `destroy()` - Cleans up event listeners

### MobileMenu (mobile-menu.js)

Manages mobile menu behavior with focus trap and scroll lock.

**Constructor Options:**
- `animationDuration` (number): Duration in ms (default: 300)
- `onOpen` (Function): Callback when menu opens
- `onClose` (Function): Callback when menu closes

**Methods:**
- `init()` - Initializes mobile menu
- `open()` - Opens the mobile menu
- `close()` - Closes the mobile menu
- `toggle()` - Toggles menu state
- `isMenuOpen()` - Returns true if menu is open
- `destroy()` - Cleans up and removes listeners

**Features:**
- Body scroll lock when menu is open
- Focus trap to keep focus within menu
- Closes on Escape key
- Closes on click outside
- Closes when window resized to desktop size
- Smooth animations with CSS classes

### FocusTrap (focus-trap.js)

Reusable utility for trapping focus within a container.

**Constructor Options:**
- `initialFocus` (boolean): Focus first element on activation (default: true)
- `returnFocusOnDeactivate` (boolean): Return focus to trigger element (default: true)
- `onActivate` (Function): Callback when trap activates
- `onDeactivate` (Function): Callback when trap deactivates

**Methods:**
- `activate()` - Activates the focus trap
- `deactivate()` - Deactivates the focus trap
- `updateContainer(newContainer)` - Updates the container element
- `destroy()` - Cleans up and removes trap

**Usage Example:**
```javascript
import { createFocusTrap } from '/js/navigation/focus-trap.js';

const trap = createFocusTrap(document.getElementById('modal'), {
  initialFocus: true,
  returnFocusOnDeactivate: true,
  onActivate: () => console.log('Trap activated'),
  onDeactivate: () => console.log('Trap deactivated')
});

trap.activate();   // Trap focus
trap.deactivate(); // Release focus
```

## Accessibility Features

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard support for all interactions
- **ARIA Attributes**: Proper use of `role`, `aria-expanded`, `aria-current`, `aria-label`, etc.
- **Focus Management**: Clear focus indicators and logical focus order
- **Screen Reader Support**: Live regions announce state changes
- **Skip Links**: "Skip to main content" link at top of page

### Screen Reader Announcements

The navigation system announces important state changes:
- "Mobile menu opened/closed"
- "[Submenu name] opened"
- Active page is marked with `aria-current="page"`

### Focus Trap

When dropdowns or mobile menu are open:
- Tab cycles through items within the menu
- Focus cannot escape to page content
- Escape key closes menu and returns focus
- Click outside closes menu and returns focus

## CSS Integration

The navigation system adds these CSS classes for styling:

**Mobile Menu States:**
- `.mobile-open` - Menu is open
- `.mobile-opening` - Menu is opening (animation)
- `.mobile-closing` - Menu is closing (animation)

**Dropdown States:**
- `.active` - Dropdown is open
- `.nav-dropdown-toggle[aria-expanded="true"]` - Toggle in expanded state

**Active Page:**
- `.active` - Current page link
- `[aria-current="page"]` - Current page (for styling)

**Body Class:**
- `.mobile-menu-open` - Added to body when mobile menu is open

## Browser Support

- Modern browsers with ES6 module support
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

For older browsers, consider using a bundler with Babel transpilation.

## Testing

### Manual Testing Checklist

- [ ] Navigation loads on page load
- [ ] Active page is highlighted correctly
- [ ] Keyboard navigation works (arrow keys, Enter, Escape)
- [ ] Dropdown menus open/close with keyboard
- [ ] Mobile menu opens/closes with toggle button
- [ ] Mobile menu closes on Escape key
- [ ] Mobile menu closes on click outside
- [ ] Body scroll locks when mobile menu is open
- [ ] Focus returns to trigger after closing menus
- [ ] Screen reader announces menu states
- [ ] Tab key works as expected
- [ ] Mobile menu closes when resizing to desktop

### Screen Reader Testing

Test with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

## Performance

- **Lazy Loading**: Navigation loads asynchronously
- **Event Delegation**: Minimal event listeners
- **Memory Management**: Proper cleanup with `destroy()` methods
- **No External Dependencies**: Pure vanilla JavaScript

## Examples

### Basic Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ResuMate - Home</title>
  <link rel="stylesheet" href="/css/navigation.css">
</head>
<body>
  <!-- Navigation will be injected here -->

  <main id="main-content">
    <h1>Welcome to ResuMate</h1>
  </main>

  <script type="module">
    import { autoInit } from '/js/navigation/index.js';
    autoInit();
  </script>
</body>
</html>
```

### Custom Integration

```javascript
import { Navigation } from '/js/navigation/index.js';

class MyApp {
  constructor() {
    this.nav = null;
  }

  async init() {
    // Initialize navigation
    this.nav = new Navigation({
      onLoad: this.onNavLoaded.bind(this),
      onError: this.onNavError.bind(this)
    });

    await this.nav.init();

    // Get mobile menu instance
    const mobileMenu = this.nav.getMobileMenu();

    // Custom behavior
    mobileMenu.options.onOpen = () => {
      console.log('Mobile menu opened');
      this.pauseVideo();
    };
  }

  onNavLoaded(navInstance) {
    console.log('Navigation ready!', navInstance);
  }

  onNavError(error) {
    console.error('Navigation failed:', error);
    // Show fallback navigation
    this.showFallbackNav();
  }

  pauseVideo() {
    // Custom app logic
  }

  showFallbackNav() {
    // Fallback logic
  }
}

const app = new MyApp();
app.init();
```

### Using Focus Trap in Modal

```javascript
import { createFocusTrap } from '/js/navigation/focus-trap.js';

class Modal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.trap = createFocusTrap(modalElement, {
      returnFocusOnDeactivate: true,
      onDeactivate: () => this.close()
    });
  }

  open() {
    this.modal.style.display = 'block';
    this.trap.activate();
  }

  close() {
    this.modal.style.display = 'none';
    this.trap.deactivate();
  }
}
```

## Troubleshooting

### Navigation doesn't load

**Check:**
1. Component path is correct (`/components/navigation.html`)
2. Browser console for errors
3. Network tab shows 200 response for component
4. ES6 modules are supported in your browser

### Keyboard navigation not working

**Check:**
1. Navigation is fully initialized
2. No JavaScript errors in console
3. Focus is visible (check CSS focus styles)
4. Elements have correct ARIA attributes

### Mobile menu doesn't close

**Check:**
1. Event listeners are attached correctly
2. No JavaScript errors preventing execution
3. Scroll lock is not interfering with event handlers

### Focus trap not working

**Check:**
1. Container has focusable elements
2. Elements are not hidden or disabled
3. Tab key is not prevented by other code

## Contributing

When modifying the navigation system:

1. Maintain JSDoc comments
2. Follow existing code style
3. Test keyboard navigation thoroughly
4. Test with screen readers
5. Verify mobile responsiveness
6. Check browser console for errors
7. Update this README if API changes

## License

Part of the ResuMate project.

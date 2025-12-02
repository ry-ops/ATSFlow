/**
 * Keyboard Navigation Handler
 * WCAG 2.1 AA compliant keyboard navigation for navigation menu
 *
 * @module navigation/keyboard-nav
 */

/**
 * Manages keyboard navigation for the navigation menu
 * Implements ARIA authoring practices for menu navigation
 *
 * @class KeyboardNavigation
 */
export class KeyboardNavigation {
  /**
   * @param {HTMLElement} navElement - The navigation element
   */
  constructor(navElement) {
    this.navElement = navElement;
    this.menuItems = [];
    this.dropdowns = [];
    this.currentDropdown = null;
    this.currentIndex = -1;

    this.boundHandleKeydown = this.handleKeydown.bind(this);
    this.boundHandleDropdownKeydown = this.handleDropdownKeydown.bind(this);
  }

  /**
   * Initializes keyboard navigation
   */
  init() {
    if (!this.navElement) return;

    // Get all top-level menu items (dropdowns and regular links)
    this.menuItems = Array.from(
      this.navElement.querySelectorAll('.nav-item')
    );

    // Get all dropdown containers
    this.dropdowns = Array.from(
      this.navElement.querySelectorAll('.nav-dropdown')
    );

    // Add keyboard listeners to dropdown toggles
    this.dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      if (toggle) {
        toggle.addEventListener('keydown', this.boundHandleKeydown);
      }
    });

    // Add keyboard listeners to top-level navigation
    const menubar = this.navElement.querySelector('[role="menubar"]');
    if (menubar) {
      menubar.addEventListener('keydown', this.boundHandleKeydown);
    }
  }

  /**
   * Handles keyboard events for top-level navigation
   * @param {KeyboardEvent} event - The keyboard event
   * @private
   */
  handleKeydown(event) {
    const { key } = event;

    switch (key) {
      case 'ArrowRight':
        event.preventDefault();
        this.navigateRight();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this.navigateLeft();
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.openCurrentDropdown();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.closeCurrentDropdown();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateCurrentItem();
        break;

      case 'Escape':
        event.preventDefault();
        this.closeAllDropdowns();
        break;

      case 'Home':
        event.preventDefault();
        this.navigateToFirst();
        break;

      case 'End':
        event.preventDefault();
        this.navigateToLast();
        break;

      case 'Tab':
        // Allow natural tab behavior but close dropdowns
        this.closeAllDropdowns();
        break;
    }
  }

  /**
   * Handles keyboard events within dropdown menus
   * @param {KeyboardEvent} event - The keyboard event
   * @param {HTMLElement} dropdown - The dropdown element
   * @private
   */
  handleDropdownKeydown(event, dropdown) {
    const { key } = event;
    const items = Array.from(
      dropdown.querySelectorAll('.nav-dropdown-link')
    );

    const currentIndex = items.indexOf(document.activeElement);

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextDropdownItem(items, currentIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousDropdownItem(items, currentIndex);
        break;

      case 'Home':
        event.preventDefault();
        if (items.length > 0) items[0].focus();
        break;

      case 'End':
        event.preventDefault();
        if (items.length > 0) items[items.length - 1].focus();
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown(dropdown);
        // Return focus to toggle
        dropdown.querySelector('.nav-dropdown-toggle')?.focus();
        break;

      case 'Tab':
        // Allow tab to exit dropdown
        event.preventDefault();
        this.closeDropdown(dropdown);
        // Move to next top-level item
        this.navigateRight();
        break;
    }
  }

  /**
   * Navigate to the next top-level menu item
   * @private
   */
  navigateRight() {
    const currentItem = document.activeElement.closest('.nav-item');
    const currentIndex = this.menuItems.indexOf(currentItem);

    if (currentIndex === -1) {
      // No item focused, focus first
      this.focusMenuItem(0);
      return;
    }

    const nextIndex = (currentIndex + 1) % this.menuItems.length;
    this.focusMenuItem(nextIndex);
  }

  /**
   * Navigate to the previous top-level menu item
   * @private
   */
  navigateLeft() {
    const currentItem = document.activeElement.closest('.nav-item');
    const currentIndex = this.menuItems.indexOf(currentItem);

    if (currentIndex === -1) {
      // No item focused, focus last
      this.focusMenuItem(this.menuItems.length - 1);
      return;
    }

    const prevIndex = currentIndex === 0
      ? this.menuItems.length - 1
      : currentIndex - 1;
    this.focusMenuItem(prevIndex);
  }

  /**
   * Navigate to first menu item
   * @private
   */
  navigateToFirst() {
    this.focusMenuItem(0);
  }

  /**
   * Navigate to last menu item
   * @private
   */
  navigateToLast() {
    this.focusMenuItem(this.menuItems.length - 1);
  }

  /**
   * Focus a menu item by index
   * @param {number} index - The index of the menu item
   * @private
   */
  focusMenuItem(index) {
    if (index < 0 || index >= this.menuItems.length) return;

    const item = this.menuItems[index];
    const toggle = item.querySelector('.nav-dropdown-toggle');
    const link = item.querySelector('a[role="menuitem"]');

    if (toggle) {
      toggle.focus();
    } else if (link) {
      link.focus();
    }

    this.currentIndex = index;
  }

  /**
   * Opens the current dropdown menu
   * @private
   */
  openCurrentDropdown() {
    const currentItem = document.activeElement.closest('.nav-item');
    const dropdown = currentItem?.querySelector('.nav-dropdown');

    if (!dropdown) return;

    this.closeAllDropdowns();
    this.openDropdown(dropdown);

    // Focus first item in dropdown
    const firstLink = dropdown.querySelector('.nav-dropdown-link');
    if (firstLink) {
      firstLink.focus();
    }
  }

  /**
   * Opens a specific dropdown
   * @param {HTMLElement} dropdown - The dropdown element
   * @private
   */
  openDropdown(dropdown) {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    const menu = dropdown.querySelector('.nav-dropdown-menu');

    if (!toggle || !menu) return;

    dropdown.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    this.currentDropdown = dropdown;

    // Add keyboard handler for this dropdown
    menu.addEventListener('keydown', (e) => {
      this.handleDropdownKeydown(e, dropdown);
    });

    // Announce to screen readers
    this.announce(`${toggle.textContent.trim()} submenu opened`);
  }

  /**
   * Closes the current dropdown
   * @private
   */
  closeCurrentDropdown() {
    if (this.currentDropdown) {
      this.closeDropdown(this.currentDropdown);
    }
  }

  /**
   * Closes a specific dropdown
   * @param {HTMLElement} dropdown - The dropdown element
   * @private
   */
  closeDropdown(dropdown) {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');

    if (!toggle) return;

    dropdown.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');

    if (this.currentDropdown === dropdown) {
      this.currentDropdown = null;
    }
  }

  /**
   * Closes all open dropdowns
   * @private
   */
  closeAllDropdowns() {
    this.dropdowns.forEach(dropdown => {
      this.closeDropdown(dropdown);
    });
  }

  /**
   * Activates the current menu item (click or navigate)
   * @private
   */
  activateCurrentItem() {
    const activeElement = document.activeElement;

    // If it's a dropdown toggle, open/close it
    if (activeElement.classList.contains('nav-dropdown-toggle')) {
      const dropdown = activeElement.closest('.nav-dropdown');
      if (dropdown.classList.contains('active')) {
        this.closeDropdown(dropdown);
      } else {
        this.openDropdown(dropdown);
      }
      return;
    }

    // If it's a link, trigger click
    if (activeElement.tagName === 'A') {
      activeElement.click();
    }
  }

  /**
   * Focus next item in dropdown
   * @param {HTMLElement[]} items - Array of dropdown items
   * @param {number} currentIndex - Current focused index
   * @private
   */
  focusNextDropdownItem(items, currentIndex) {
    if (items.length === 0) return;

    const nextIndex = currentIndex === -1 || currentIndex === items.length - 1
      ? 0
      : currentIndex + 1;

    items[nextIndex].focus();
  }

  /**
   * Focus previous item in dropdown
   * @param {HTMLElement[]} items - Array of dropdown items
   * @param {number} currentIndex - Current focused index
   * @private
   */
  focusPreviousDropdownItem(items, currentIndex) {
    if (items.length === 0) return;

    const prevIndex = currentIndex === -1 || currentIndex === 0
      ? items.length - 1
      : currentIndex - 1;

    items[prevIndex].focus();
  }

  /**
   * Announces message to screen readers
   * @param {string} message - Message to announce
   * @private
   */
  announce(message) {
    // Create or get existing live region
    let liveRegion = document.getElementById('nav-live-region');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'nav-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Clear and set new message
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Destroys keyboard navigation and cleans up
   */
  destroy() {
    // Remove all event listeners
    this.dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      if (toggle) {
        toggle.removeEventListener('keydown', this.boundHandleKeydown);
      }
    });

    const menubar = this.navElement?.querySelector('[role="menubar"]');
    if (menubar) {
      menubar.removeEventListener('keydown', this.boundHandleKeydown);
    }

    // Clean up live region
    const liveRegion = document.getElementById('nav-live-region');
    if (liveRegion) {
      liveRegion.remove();
    }

    this.menuItems = [];
    this.dropdowns = [];
    this.currentDropdown = null;
  }
}

/**
 * Creates and initializes keyboard navigation
 * @param {HTMLElement} navElement - The navigation element
 * @returns {KeyboardNavigation} Initialized keyboard navigation instance
 */
export function initKeyboardNav(navElement) {
  const keyboardNav = new KeyboardNavigation(navElement);
  keyboardNav.init();
  return keyboardNav;
}

/**
 * Mobile Menu Controller
 * Handles mobile navigation menu interactions and accessibility
 *
 * @module navigation/mobile-menu
 */

import { createFocusTrap } from './focus-trap.js';

/**
 * Manages mobile menu behavior including animations, scroll lock, and accessibility
 *
 * @class MobileMenu
 */
export class MobileMenu {
  /**
   * @param {HTMLElement} navElement - The navigation element
   * @param {Object} options - Configuration options
   * @param {number} options.animationDuration - Duration of open/close animation in ms
   * @param {Function} options.onOpen - Callback when menu opens
   * @param {Function} options.onClose - Callback when menu closes
   */
  constructor(navElement, options = {}) {
    this.navElement = navElement;
    this.options = {
      animationDuration: 300,
      onOpen: null,
      onClose: null,
      ...options
    };

    this.toggle = null;
    this.menu = null;
    this.focusTrap = null;
    this.isOpen = false;
    this.scrollPosition = 0;

    this.boundHandleToggleClick = this.handleToggleClick.bind(this);
    this.boundHandleEscapeKey = this.handleEscapeKey.bind(this);
    this.boundHandleClickOutside = this.handleClickOutside.bind(this);
    this.boundHandleResize = this.handleResize.bind(this);
  }

  /**
   * Initializes mobile menu
   */
  init() {
    if (!this.navElement) return;

    this.toggle = this.navElement.querySelector('.navbar-toggle');
    this.menu = this.navElement.querySelector('.navbar-nav');

    if (!this.toggle || !this.menu) {
      console.warn('Mobile menu: Toggle or menu element not found');
      return;
    }

    // Add event listeners
    this.toggle.addEventListener('click', this.boundHandleToggleClick);
    document.addEventListener('keydown', this.boundHandleEscapeKey);
    window.addEventListener('resize', this.boundHandleResize);

    // Create focus trap for mobile menu
    this.focusTrap = createFocusTrap(this.menu, {
      initialFocus: true,
      returnFocusOnDeactivate: true,
      onActivate: () => {
        this.announce('Mobile menu opened');
      },
      onDeactivate: () => {
        this.announce('Mobile menu closed');
      }
    });

    // Check initial state
    this.isOpen = this.menu.classList.contains('mobile-open');
    if (this.isOpen) {
      this.enableBodyScrollLock();
      this.focusTrap.activate();
    }
  }

  /**
   * Handles toggle button click
   * @param {Event} event - The click event
   * @private
   */
  handleToggleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Handles Escape key press
   * @param {KeyboardEvent} event - The keyboard event
   * @private
   */
  handleEscapeKey(event) {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  /**
   * Handles click outside menu
   * @param {Event} event - The click event
   * @private
   */
  handleClickOutside(event) {
    if (!this.isOpen) return;

    // Check if click is outside menu and toggle
    if (
      !this.menu.contains(event.target) &&
      !this.toggle.contains(event.target)
    ) {
      this.close();
    }
  }

  /**
   * Handles window resize
   * Closes mobile menu when viewport becomes desktop size
   * @private
   */
  handleResize() {
    // Close menu if window is resized to desktop size
    if (window.innerWidth >= 768 && this.isOpen) {
      this.close();
    }
  }

  /**
   * Opens the mobile menu
   */
  open() {
    if (this.isOpen) return;

    this.isOpen = true;

    // Add mobile-open class for animation
    this.menu.classList.add('mobile-opening');
    this.menu.classList.add('mobile-open');

    // Update ARIA attributes
    this.toggle.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');

    // Lock body scroll
    this.enableBodyScrollLock();

    // Activate focus trap
    if (this.focusTrap) {
      this.focusTrap.activate();
    }

    // Add click outside listener after a short delay
    // to prevent immediate closure
    setTimeout(() => {
      document.addEventListener('click', this.boundHandleClickOutside);
    }, 100);

    // Remove opening class after animation
    setTimeout(() => {
      this.menu.classList.remove('mobile-opening');
    }, this.options.animationDuration);

    // Call onOpen callback
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen();
    }
  }

  /**
   * Closes the mobile menu
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // Add closing class for animation
    this.menu.classList.add('mobile-closing');

    // Update ARIA attributes
    this.toggle.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');

    // Deactivate focus trap
    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }

    // Remove click outside listener
    document.removeEventListener('click', this.boundHandleClickOutside);

    // Unlock body scroll
    this.disableBodyScrollLock();

    // Remove classes after animation
    setTimeout(() => {
      this.menu.classList.remove('mobile-open');
      this.menu.classList.remove('mobile-closing');
    }, this.options.animationDuration);

    // Call onClose callback
    if (typeof this.options.onClose === 'function') {
      this.options.onClose();
    }
  }

  /**
   * Toggles the mobile menu
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Enables body scroll lock when menu is open
   * @private
   */
  enableBodyScrollLock() {
    // Save current scroll position
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Apply styles to body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';

    // Add class for additional styling if needed
    document.body.classList.add('mobile-menu-open');
  }

  /**
   * Disables body scroll lock when menu is closed
   * @private
   */
  disableBodyScrollLock() {
    // Remove styles from body
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');

    // Remove class
    document.body.classList.remove('mobile-menu-open');

    // Restore scroll position
    window.scrollTo(0, this.scrollPosition);
  }

  /**
   * Checks if menu is currently open
   * @returns {boolean} True if menu is open
   */
  isMenuOpen() {
    return this.isOpen;
  }

  /**
   * Announces message to screen readers
   * @param {string} message - Message to announce
   * @private
   */
  announce(message) {
    // Create or get existing live region
    let liveRegion = document.getElementById('mobile-menu-live-region');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'mobile-menu-live-region';
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
   * Destroys mobile menu and cleans up
   */
  destroy() {
    // Close menu if open
    if (this.isOpen) {
      this.close();
    }

    // Remove event listeners
    if (this.toggle) {
      this.toggle.removeEventListener('click', this.boundHandleToggleClick);
    }

    document.removeEventListener('keydown', this.boundHandleEscapeKey);
    document.removeEventListener('click', this.boundHandleClickOutside);
    window.removeEventListener('resize', this.boundHandleResize);

    // Destroy focus trap
    if (this.focusTrap) {
      this.focusTrap.destroy();
      this.focusTrap = null;
    }

    // Clean up live region
    const liveRegion = document.getElementById('mobile-menu-live-region');
    if (liveRegion) {
      liveRegion.remove();
    }

    // Clean up references
    this.toggle = null;
    this.menu = null;
    this.navElement = null;
  }
}

/**
 * Creates and initializes mobile menu
 * @param {HTMLElement} navElement - The navigation element
 * @param {Object} options - Configuration options
 * @returns {MobileMenu} Initialized mobile menu instance
 */
export function initMobileMenu(navElement, options) {
  const mobileMenu = new MobileMenu(navElement, options);
  mobileMenu.init();
  return mobileMenu;
}

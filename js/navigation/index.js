/**
 * Navigation Module - Main Controller
 * Initializes and coordinates all navigation features for ResuMate
 *
 * @module navigation
 */

import { initKeyboardNav } from './keyboard-nav.js';
import { initMobileMenu } from './mobile-menu.js';

/**
 * Main navigation controller class
 * Manages loading, initialization, and coordination of navigation features
 *
 * @class Navigation
 */
export class Navigation {
  /**
   * @param {Object} options - Configuration options
   * @param {string} options.componentPath - Path to navigation.html component
   * @param {string} options.mountSelector - Selector for mount point
   * @param {Function} options.onLoad - Callback after navigation loads
   * @param {Function} options.onError - Callback on error
   */
  constructor(options = {}) {
    this.options = {
      componentPath: '/components/navigation.html',
      mountSelector: 'body',
      onLoad: null,
      onError: null,
      ...options
    };

    this.navElement = null;
    this.keyboardNav = null;
    this.mobileMenu = null;
    this.isInitialized = false;
  }

  /**
   * Loads and initializes the navigation component
   * @returns {Promise<void>}
   */
  async init() {
    if (this.isInitialized) {
      console.warn('Navigation already initialized');
      return;
    }

    try {
      // Load navigation component
      await this.loadComponent();

      // Get navigation element
      this.navElement = document.querySelector('.resumate-navbar');

      if (!this.navElement) {
        throw new Error('Navigation element not found after loading component');
      }

      // Initialize all features
      this.initActivePageDetection();
      this.initDropdowns();
      this.initShortcutsMenu();

      // Initialize keyboard navigation
      this.keyboardNav = initKeyboardNav(this.navElement);

      // Initialize mobile menu
      this.mobileMenu = initMobileMenu(this.navElement);

      this.isInitialized = true;

      // Call onLoad callback
      if (typeof this.options.onLoad === 'function') {
        this.options.onLoad(this);
      }

      console.log('Navigation initialized successfully');
    } catch (error) {
      console.error('Failed to initialize navigation:', error);

      if (typeof this.options.onError === 'function') {
        this.options.onError(error);
      }

      throw error;
    }
  }

  /**
   * Loads the navigation HTML component
   * @returns {Promise<void>}
   * @private
   */
  async loadComponent() {
    try {
      const response = await fetch(this.options.componentPath);

      if (!response.ok) {
        throw new Error(`Failed to load navigation: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();

      // Create temporary container
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;

      // Get mount point
      const mountPoint = document.querySelector(this.options.mountSelector);
      if (!mountPoint) {
        throw new Error(`Mount point not found: ${this.options.mountSelector}`);
      }

      // Insert navigation at the beginning of mount point
      const navElement = tempContainer.querySelector('.resumate-navbar');
      const shortcutsElement = tempContainer.querySelector('.feature-shortcuts');

      if (navElement) {
        mountPoint.insertBefore(navElement, mountPoint.firstChild);
      }

      if (shortcutsElement) {
        mountPoint.appendChild(shortcutsElement);
      }

      // Remove old inline script from component (we're handling it in modules)
      const oldScript = document.querySelector('nav.resumate-navbar ~ script');
      if (oldScript) {
        oldScript.remove();
      }

    } catch (error) {
      console.error('Error loading navigation component:', error);
      throw error;
    }
  }

  /**
   * Initializes active page detection and marking
   * Adds aria-current="page" to current page links
   * @private
   */
  initActivePageDetection() {
    // Get current page from URL
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    // Find all navigation links
    const links = this.navElement.querySelectorAll('a[href]');

    links.forEach(link => {
      const href = link.getAttribute('href');

      // Check if this link points to the current page
      if (
        href === currentPage ||
        href === `/${currentPage}` ||
        href === currentPath
      ) {
        // Add active class
        link.classList.add('active');

        // Add ARIA attribute for accessibility
        link.setAttribute('aria-current', 'page');

        // If link is in a dropdown, mark parent dropdown as active
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          const dropdownToggle = parentDropdown.querySelector('.nav-dropdown-toggle');
          if (dropdownToggle) {
            dropdownToggle.classList.add('active');
            dropdownToggle.setAttribute('aria-current', 'true');
          }
        }
      }
    });
  }

  /**
   * Initializes dropdown menu interactions
   * @private
   */
  initDropdowns() {
    const dropdowns = this.navElement.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      const menu = dropdown.querySelector('.nav-dropdown-menu');

      if (!toggle || !menu) return;

      // Click handler for toggle
      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        // Close all other dropdowns
        this.closeAllDropdowns();

        if (!isExpanded) {
          // Open this dropdown
          dropdown.classList.add('active');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });

      // Close dropdown when clicking a link inside
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.closeDropdown(dropdown);
        });
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        this.closeAllDropdowns();
      }
    });
  }

  /**
   * Closes a specific dropdown
   * @param {HTMLElement} dropdown - The dropdown element to close
   * @private
   */
  closeDropdown(dropdown) {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');

    dropdown.classList.remove('active');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Closes all dropdowns
   * @private
   */
  closeAllDropdowns() {
    const dropdowns = this.navElement.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => this.closeDropdown(dropdown));
  }

  /**
   * Initializes feature shortcuts menu
   * @private
   */
  initShortcutsMenu() {
    const shortcutsToggle = document.querySelector('.shortcuts-toggle');
    const shortcutsMenu = document.querySelector('.shortcuts-menu');

    if (!shortcutsToggle || !shortcutsMenu) {
      return; // Shortcuts menu is optional
    }

    // Toggle shortcuts menu
    shortcutsToggle.addEventListener('click', (event) => {
      event.stopPropagation();

      const isActive = shortcutsMenu.classList.contains('active');

      if (isActive) {
        shortcutsMenu.classList.remove('active');
        shortcutsToggle.setAttribute('aria-expanded', 'false');
      } else {
        shortcutsMenu.classList.add('active');
        shortcutsToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.feature-shortcuts')) {
        shortcutsMenu.classList.remove('active');
        shortcutsToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && shortcutsMenu.classList.contains('active')) {
        shortcutsMenu.classList.remove('active');
        shortcutsToggle.setAttribute('aria-expanded', 'false');
        shortcutsToggle.focus();
      }
    });

    // Close when clicking a link inside
    shortcutsMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        shortcutsMenu.classList.remove('active');
        shortcutsToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /**
   * Updates active page highlighting
   * Call this after navigation or when page changes dynamically
   * @param {string} pagePath - Path to the active page
   */
  updateActivePage(pagePath) {
    if (!this.navElement) return;

    // Remove all active states
    this.navElement.querySelectorAll('.active').forEach(el => {
      el.classList.remove('active');
      el.removeAttribute('aria-current');
    });

    // Reinitialize active page detection with new path
    this.initActivePageDetection();
  }

  /**
   * Gets the mobile menu instance
   * @returns {MobileMenu|null} The mobile menu instance
   */
  getMobileMenu() {
    return this.mobileMenu;
  }

  /**
   * Gets the keyboard navigation instance
   * @returns {KeyboardNavigation|null} The keyboard navigation instance
   */
  getKeyboardNav() {
    return this.keyboardNav;
  }

  /**
   * Destroys the navigation and cleans up
   */
  destroy() {
    // Destroy keyboard navigation
    if (this.keyboardNav) {
      this.keyboardNav.destroy();
      this.keyboardNav = null;
    }

    // Destroy mobile menu
    if (this.mobileMenu) {
      this.mobileMenu.destroy();
      this.mobileMenu = null;
    }

    // Remove navigation element
    if (this.navElement) {
      this.navElement.remove();
      this.navElement = null;
    }

    // Remove shortcuts menu
    const shortcutsElement = document.querySelector('.feature-shortcuts');
    if (shortcutsElement) {
      shortcutsElement.remove();
    }

    this.isInitialized = false;
  }
}

/**
 * Creates and initializes navigation
 * @param {Object} options - Configuration options
 * @returns {Promise<Navigation>} Initialized navigation instance
 */
export async function initNavigation(options) {
  const navigation = new Navigation(options);
  await navigation.init();
  return navigation;
}

/**
 * Auto-initializes navigation when DOM is ready
 * Call this to automatically load navigation on page load
 */
export function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        await initNavigation();
      } catch (error) {
        console.error('Auto-initialization failed:', error);
      }
    });
  } else {
    // DOM already loaded
    initNavigation().catch(error => {
      console.error('Auto-initialization failed:', error);
    });
  }
}

// Export default instance for easy import
export default {
  Navigation,
  initNavigation,
  autoInit
};

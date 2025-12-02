/**
 * Focus Trap Utility
 * Traps keyboard focus within a container element for accessibility
 *
 * @module navigation/focus-trap
 */

/**
 * Creates a focus trap within a container element
 * Manages focus cycling and returns focus on deactivation
 *
 * @class FocusTrap
 */
export class FocusTrap {
  /**
   * @param {HTMLElement} container - The container element to trap focus within
   * @param {Object} options - Configuration options
   * @param {boolean} options.initialFocus - Whether to focus first element on activation
   * @param {boolean} options.returnFocusOnDeactivate - Whether to return focus to trigger element
   * @param {Function} options.onActivate - Callback when trap is activated
   * @param {Function} options.onDeactivate - Callback when trap is deactivated
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      initialFocus: true,
      returnFocusOnDeactivate: true,
      onActivate: null,
      onDeactivate: null,
      ...options
    };

    this.isActive = false;
    this.previouslyFocusedElement = null;
    this.boundHandleKeydown = this.handleKeydown.bind(this);
  }

  /**
   * Gets all focusable elements within the container
   * @returns {HTMLElement[]} Array of focusable elements
   * @private
   */
  getFocusableElements() {
    if (!this.container) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const elements = Array.from(
      this.container.querySelectorAll(focusableSelectors)
    );

    // Filter out hidden elements
    return elements.filter(el => {
      return el.offsetParent !== null &&
             window.getComputedStyle(el).visibility !== 'hidden' &&
             !el.hasAttribute('hidden');
    });
  }

  /**
   * Handles Tab and Shift+Tab key presses to cycle focus
   * @param {KeyboardEvent} event - The keyboard event
   * @private
   */
  handleKeydown(event) {
    if (event.key !== 'Tab') return;

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Handle Shift+Tab on first element - cycle to last
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    // Handle Tab on last element - cycle to first
    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    // If focus is outside the trap, bring it back to first element
    if (!this.container.contains(document.activeElement)) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Activates the focus trap
   * @returns {FocusTrap} Returns this for chaining
   */
  activate() {
    if (this.isActive) return this;

    this.previouslyFocusedElement = document.activeElement;
    this.isActive = true;

    // Add keydown listener
    document.addEventListener('keydown', this.boundHandleKeydown, true);

    // Focus first element if option is enabled
    if (this.options.initialFocus) {
      const focusableElements = this.getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // Call activation callback
    if (typeof this.options.onActivate === 'function') {
      this.options.onActivate();
    }

    return this;
  }

  /**
   * Deactivates the focus trap and optionally returns focus
   * @returns {FocusTrap} Returns this for chaining
   */
  deactivate() {
    if (!this.isActive) return this;

    this.isActive = false;

    // Remove keydown listener
    document.removeEventListener('keydown', this.boundHandleKeydown, true);

    // Return focus to previously focused element
    if (
      this.options.returnFocusOnDeactivate &&
      this.previouslyFocusedElement &&
      typeof this.previouslyFocusedElement.focus === 'function'
    ) {
      this.previouslyFocusedElement.focus();
    }

    // Call deactivation callback
    if (typeof this.options.onDeactivate === 'function') {
      this.options.onDeactivate();
    }

    this.previouslyFocusedElement = null;

    return this;
  }

  /**
   * Updates the container element
   * Useful if the container is dynamically replaced
   * @param {HTMLElement} newContainer - The new container element
   */
  updateContainer(newContainer) {
    const wasActive = this.isActive;
    if (wasActive) {
      this.deactivate();
    }
    this.container = newContainer;
    if (wasActive) {
      this.activate();
    }
  }

  /**
   * Destroys the focus trap and cleans up
   */
  destroy() {
    this.deactivate();
    this.container = null;
    this.previouslyFocusedElement = null;
  }
}

/**
 * Creates and returns a new FocusTrap instance
 * @param {HTMLElement} container - The container element
 * @param {Object} options - Configuration options
 * @returns {FocusTrap} New FocusTrap instance
 */
export function createFocusTrap(container, options) {
  return new FocusTrap(container, options);
}

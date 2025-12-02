/**
 * Template Selector UI Component
 * Provides a visual interface for selecting and previewing resume templates
 */

class TemplateSelector {
    constructor() {
        this.currentTemplate = null;
        this.onTemplateChange = null;
    }

    /**
     * Create and render the template selector UI
     * @param {HTMLElement} container - Container element to render into
     * @param {Function} onSelect - Callback when template is selected
     */
    render(container, onSelect) {
        this.onTemplateChange = onSelect;

        const templates = window.TemplateRegistry.getAllTemplates();

        container.innerHTML = `
            <div class="template-selector-container">
                <div class="template-selector-header">
                    <h3>Choose Your Template</h3>
                    <p>Select a professional resume template that matches your industry and style</p>
                </div>

                <div class="template-grid">
                    ${templates.map(template => this.createTemplateCard(template)).join('')}
                </div>

                <div class="template-selector-footer">
                    <button class="btn-secondary" onclick="templateSelector.close()">Cancel</button>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachEventListeners(container);
    }

    /**
     * Create HTML for a template card
     * @param {Object} template - Template metadata
     * @returns {string} HTML string
     */
    createTemplateCard(template) {
        const atsScoreClass = this.getAtsScoreClass(template.atsScore);
        const currentTemplate = window.TemplateEngine?.getCurrentTemplate();
        const isActive = currentTemplate && currentTemplate.id === template.id;

        return `
            <div class="template-card ${isActive ? 'active' : ''}" data-template-id="${template.id}">
                <div class="template-preview-wrapper">
                    <div class="template-preview-mock ${template.id}">
                        <div class="mock-header"></div>
                        <div class="mock-content">
                            <div class="mock-line"></div>
                            <div class="mock-line short"></div>
                            <div class="mock-section"></div>
                            <div class="mock-line"></div>
                            <div class="mock-line medium"></div>
                        </div>
                    </div>
                </div>

                <div class="template-card-content">
                    <div class="template-card-header">
                        <h4 class="template-name">${template.name}</h4>
                        <span class="template-badge ${atsScoreClass}">
                            ATS: ${template.atsScore}%
                        </span>
                    </div>

                    <p class="template-description">${template.description}</p>

                    <div class="template-meta">
                        <div class="template-features">
                            <span class="feature-tag">${template.layout.type}</span>
                            <span class="feature-tag">${template.typography.headingFont.split(',')[0]}</span>
                            ${template.features.colorSupport ? '<span class="feature-tag">Color</span>' : ''}
                            ${template.features.multiColumn ? '<span class="feature-tag">2-Col</span>' : ''}
                        </div>
                    </div>

                    <div class="template-industries">
                        <small>Best for: ${template.bestFor.slice(0, 3).join(', ')}</small>
                    </div>

                    <button class="btn-select-template ${isActive ? 'btn-primary' : 'btn-secondary'}"
                            data-template-id="${template.id}">
                        ${isActive ? 'Current Template ✓' : 'Select Template'}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get ATS score class for styling
     * @param {number} score - ATS score
     * @returns {string} CSS class name
     */
    getAtsScoreClass(score) {
        if (score >= 95) return 'ats-excellent';
        if (score >= 90) return 'ats-very-good';
        if (score >= 85) return 'ats-good';
        return 'ats-fair';
    }

    /**
     * Attach event listeners to template cards
     * @param {HTMLElement} container - Container element
     */
    attachEventListeners(container) {
        // Template card selection (click on card)
        container.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the button
                if (e.target.classList.contains('btn-select-template')) return;

                const templateId = card.dataset.templateId;
                this.previewTemplate(templateId);
            });
        });

        // Template selection buttons
        container.querySelectorAll('.btn-select-template').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const templateId = button.dataset.templateId;
                this.selectTemplate(templateId);
            });
        });
    }

    /**
     * Preview a template (show visual feedback)
     * @param {string} templateId - Template identifier
     */
    previewTemplate(templateId) {
        const cards = document.querySelectorAll('.template-card');
        cards.forEach(card => {
            if (card.dataset.templateId === templateId) {
                card.classList.add('previewing');
            } else {
                card.classList.remove('previewing');
            }
        });
    }

    /**
     * Select and apply a template
     * @param {string} templateId - Template identifier
     */
    async selectTemplate(templateId) {
        try {
            // Switch template via engine
            const success = await window.TemplateEngine.switchTemplate(templateId);

            if (success) {
                // Update UI
                const cards = document.querySelectorAll('.template-card');
                cards.forEach(card => {
                    const button = card.querySelector('.btn-select-template');
                    if (card.dataset.templateId === templateId) {
                        card.classList.add('active');
                        button.textContent = 'Current Template ✓';
                        button.classList.remove('btn-secondary');
                        button.classList.add('btn-primary');
                    } else {
                        card.classList.remove('active');
                        button.textContent = 'Select Template';
                        button.classList.remove('btn-primary');
                        button.classList.add('btn-secondary');
                    }
                });

                // Call callback if provided
                if (this.onTemplateChange) {
                    this.onTemplateChange(templateId);
                }

                // Show success notification
                this.showNotification(`Template changed to ${templateId}`, 'success');
            } else {
                this.showNotification(`Failed to load template`, 'error');
            }
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Error selecting template:', error);
            this.showNotification(`Error: ${error.message}`, 'error');
        }
    }

    /**
     * Show a notification message
     * @param {string} message - Message to display
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Check if notification system exists
        if (window.NotificationManager) {
            window.NotificationManager.show(message, type);
        } else {
            // Fallback to console
            if (typeof logger !== 'undefined') logger.info(`[${type.toUpperCase()}] ${message}`);
        }
    }

    /**
     * Close the template selector
     */
    close() {
        const container = document.querySelector('.template-selector-container');
        if (container && container.parentElement) {
            container.parentElement.style.display = 'none';
        }
    }

    /**
     * Create a modal version of the template selector
     * @param {Function} onSelect - Callback when template is selected
     */
    showModal(onSelect) {
        // Create modal backdrop
        const modal = document.createElement('div');
        modal.className = 'template-selector-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="templateSelector.closeModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="templateSelector.closeModal()">×</button>
                <div class="modal-body" id="template-selector-modal-body"></div>
            </div>
        `;

        document.body.appendChild(modal);

        // Render selector into modal
        const modalBody = modal.querySelector('#template-selector-modal-body');
        this.render(modalBody, (templateId) => {
            if (onSelect) onSelect(templateId);
            this.closeModal();
        });
    }

    /**
     * Close the modal
     */
    closeModal() {
        const modal = document.querySelector('.template-selector-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// Create global instance
window.TemplateSelector = new TemplateSelector();
window.templateSelector = window.TemplateSelector; // Alias for convenience

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateSelector;
}

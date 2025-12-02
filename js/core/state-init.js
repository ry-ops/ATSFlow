/**
 * State Initialization Manager
 * Ensures all state management components initialize in correct order
 *
 * Initialization Order:
 * 1. WorkflowState (core state management)
 * 2. StateMigration (migrate old data)
 * 3. DataBridge (backward compatibility)
 * 4. UI Components (onboarding, preview, etc.)
 *
 * @version 1.0.0
 */

class StateInitManager {
    constructor() {
        this.initialized = false;
        this.components = {
            workflowState: false,
            stateMigration: false,
            dataBridge: false,
            onboarding: false,
            preview: false
        };

        console.log('[StateInit] Manager created');
    }

    /**
     * Initialize all state management components
     * @returns {Promise<boolean>} Success status
     */
    async initialize() {
        if (this.initialized) {
            console.log('[StateInit] Already initialized');
            return true;
        }

        console.log('[StateInit] Starting initialization sequence...');

        try {
            // Step 1: Verify WorkflowState is available
            await this.waitForWorkflowState();
            this.components.workflowState = true;
            console.log('[StateInit] ✅ WorkflowState ready');

            // Step 2: Run migration if needed
            await this.runMigration();
            this.components.stateMigration = true;
            console.log('[StateInit] ✅ Migration complete');

            // Step 3: Initialize DataBridge (backward compatibility)
            this.initializeDataBridge();
            this.components.dataBridge = true;
            console.log('[StateInit] ✅ DataBridge ready');

            // Step 4: Initialize UI components
            await this.initializeUIComponents();
            console.log('[StateInit] ✅ UI components ready');

            this.initialized = true;
            console.log('[StateInit] 🎉 All components initialized successfully');

            // Log final state
            this.logCurrentState();

            return true;

        } catch (error) {
            console.error('[StateInit] ❌ Initialization failed:', error);
            return false;
        }
    }

    /**
     * Wait for WorkflowState to be available
     * @returns {Promise<void>}
     */
    waitForWorkflowState() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max

            const check = () => {
                if (window.workflowState) {
                    resolve();
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        reject(new Error('WorkflowState not found after 5 seconds'));
                    } else {
                        setTimeout(check, 100);
                    }
                }
            };

            check();
        });
    }

    /**
     * Run state migration
     * @returns {Promise<void>}
     */
    async runMigration() {
        if (!window.stateMigration) {
            console.warn('[StateInit] StateMigration not available, skipping');
            return;
        }

        // Give WorkflowState a moment to fully initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        const result = window.stateMigration.autoMigrate();

        if (result.success) {
            if (result.skipped) {
                console.log('[StateInit] Migration skipped (already completed)');
            } else if (result.noDataToMigrate) {
                console.log('[StateInit] Migration skipped (no old data)');
            } else {
                console.log('[StateInit] Migration completed successfully');
            }
        } else {
            console.warn('[StateInit] Migration failed:', result.error);
        }
    }

    /**
     * Initialize DataBridge
     */
    initializeDataBridge() {
        if (!window.dataBridge) {
            console.warn('[StateInit] DataBridge not available');
            return;
        }

        // Sync DataBridge with WorkflowState
        if (window.workflowState) {
            const state = window.workflowState.getState();

            // Copy data from WorkflowState to DataBridge
            if (state.inputs?.resume?.text) {
                window.dataBridge.saveResume(state.inputs.resume.text);
            }

            if (state.inputs?.job?.description) {
                window.dataBridge.saveJob(state.inputs.job.description);
            }

            console.log('[StateInit] Synced DataBridge with WorkflowState');
        }
    }

    /**
     * Initialize UI components
     * @returns {Promise<void>}
     */
    async initializeUIComponents() {
        // Initialize onboarding if available
        if (window.onboardingManager) {
            // Give it a moment for DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 100));

            // Sync with current state
            if (window.onboardingManager.syncWithWorkflowState) {
                window.onboardingManager.syncWithWorkflowState();
            }

            this.components.onboarding = true;
            console.log('[StateInit] Onboarding manager synced');
        }

        // Initialize preview if available
        if (window.previewController) {
            // Trigger initial render if resume data exists
            const state = window.workflowState.getState();
            if (state.inputs?.resume?.text) {
                const resumeState = {
                    text: state.inputs.resume.text,
                    sections: []
                };
                window.previewController.render(resumeState);
            }

            this.components.preview = true;
            console.log('[StateInit] Preview controller synced');
        }
    }

    /**
     * Log current state for debugging
     */
    logCurrentState() {
        if (!window.workflowState) return;

        const summary = window.workflowState.getSummary();

        console.group('[StateInit] Current State Summary');
        console.log('Current Step:', summary.currentStep);
        console.log('Progress:', summary.progress + '%');
        console.log('Steps Completed:', summary.stepsCompleted + '/5');
        console.log('Has Resume:', summary.hasResume);
        console.log('Has Job:', summary.hasJob);
        console.log('Has Analysis:', summary.hasAnalysis);
        console.log('Has ATS Score:', summary.hasAtsScore);
        console.log('Documents:', summary.documentsCount);
        console.groupEnd();
    }

    /**
     * Get initialization status
     * @returns {Object} Status object
     */
    getStatus() {
        return {
            initialized: this.initialized,
            components: { ...this.components }
        };
    }

    /**
     * Reset initialization (for testing)
     */
    reset() {
        this.initialized = false;
        this.components = {
            workflowState: false,
            stateMigration: false,
            dataBridge: false,
            onboarding: false,
            preview: false
        };
        console.log('[StateInit] Reset complete');
    }
}

// Create singleton instance
const stateInitManager = new StateInitManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateInitManager;
}

// Add to window for global access
if (typeof window !== 'undefined') {
    window.StateInitManager = StateInitManager;
    window.stateInitManager = stateInitManager;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        stateInitManager.initialize();
    });
} else {
    // DOM already loaded, run immediately
    stateInitManager.initialize();
}

console.log('[StateInit] Module loaded and ready');

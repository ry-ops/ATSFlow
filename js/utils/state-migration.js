/**
 * State Migration Utility
 * Migrates old localStorage data to new workflow-state.js system
 *
 * Handles migration from:
 * - Old localStorage keys (claude_api_key, lastAnalysis, etc.)
 * - Old DataBridge format (resumate_user_data)
 * - Old workflow state format (resumate_workflow_state)
 *
 * To new format:
 * - Session storage: resumate_session_state (resume, job, analysis)
 * - Local storage: resumate_persistent_data (API key only)
 *
 * @version 1.0.0
 */

class StateMigration {
    constructor() {
        this.OLD_KEYS = [
            'claude_api_key',           // Legacy API key
            'lastAnalysis',             // Legacy analysis data
            'resumate_user_data',       // Old DataBridge format
            'resumate_workflow_state',  // Old workflow state
            'resumate_progress',        // Old onboarding progress
            'resumate_tour_completed'   // Tour completion flag
        ];

        this.migrated = false;
        console.log('[StateMigration] Initialized');
    }

    /**
     * Detect if old data exists that needs migration
     * @returns {boolean} True if migration needed
     */
    needsMigration() {
        for (const key of this.OLD_KEYS) {
            if (localStorage.getItem(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Run full migration process
     * @returns {Object} Migration result
     */
    migrate() {
        if (this.migrated) {
            console.log('[StateMigration] Already migrated');
            return { success: true, alreadyMigrated: true };
        }

        console.log('[StateMigration] Starting migration...');

        try {
            const oldData = this.collectOldData();
            const newState = this.transformToNewFormat(oldData);

            // Save to workflow state
            if (window.workflowState) {
                this.applyToWorkflowState(newState);
            }

            // Clean up old data
            this.cleanupOldData();

            this.migrated = true;

            console.log('[StateMigration] Migration completed successfully');
            return {
                success: true,
                migratedKeys: Object.keys(oldData),
                newState: newState
            };

        } catch (error) {
            console.error('[StateMigration] Migration failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Collect all old data from various storage keys
     * @private
     * @returns {Object} Collected old data
     */
    collectOldData() {
        const collected = {};

        // Legacy API key
        const apiKey = localStorage.getItem('claude_api_key');
        if (apiKey) {
            collected.apiKey = apiKey;
        }

        // Legacy analysis data
        const lastAnalysis = localStorage.getItem('lastAnalysis');
        if (lastAnalysis) {
            try {
                collected.lastAnalysis = JSON.parse(lastAnalysis);
            } catch (e) {
                console.warn('[StateMigration] Failed to parse lastAnalysis:', e);
            }
        }

        // Old DataBridge format
        const userData = localStorage.getItem('resumate_user_data');
        if (userData) {
            try {
                collected.userData = JSON.parse(userData);
            } catch (e) {
                console.warn('[StateMigration] Failed to parse userData:', e);
            }
        }

        // Old workflow state
        const workflowState = localStorage.getItem('resumate_workflow_state');
        if (workflowState) {
            try {
                collected.workflowState = JSON.parse(workflowState);
            } catch (e) {
                console.warn('[StateMigration] Failed to parse workflowState:', e);
            }
        }

        // Old progress data
        const progress = localStorage.getItem('resumate_progress');
        if (progress) {
            try {
                collected.progress = JSON.parse(progress);
            } catch (e) {
                console.warn('[StateMigration] Failed to parse progress:', e);
            }
        }

        console.log('[StateMigration] Collected old data:', {
            hasApiKey: !!collected.apiKey,
            hasAnalysis: !!collected.lastAnalysis,
            hasUserData: !!collected.userData,
            hasWorkflowState: !!collected.workflowState,
            hasProgress: !!collected.progress
        });

        return collected;
    }

    /**
     * Transform old data format to new workflow state format
     * @private
     * @param {Object} oldData - Collected old data
     * @returns {Object} New state format
     */
    transformToNewFormat(oldData) {
        const newState = {};

        // Migrate API key (persistent)
        if (oldData.apiKey) {
            newState.apiKey = oldData.apiKey;
        }

        // Migrate resume data (session)
        if (oldData.userData?.resume?.text) {
            newState.resumeText = oldData.userData.resume.text;
            newState.resumeFileName = oldData.userData.resume.fileName || null;
            newState.resumeFormat = oldData.userData.resume.format || 'text';
        } else if (oldData.lastAnalysis?.resumeText) {
            newState.resumeText = oldData.lastAnalysis.resumeText;
        }

        // Migrate job data (session)
        if (oldData.userData?.job?.description) {
            newState.jobDescription = oldData.userData.job.description;
            newState.jobTitle = oldData.userData.job.title || '';
            newState.jobCompany = oldData.userData.job.company || '';
            newState.jobUrl = oldData.userData.job.url || '';
        } else if (oldData.lastAnalysis?.jobText) {
            newState.jobDescription = oldData.lastAnalysis.jobText;
        }

        // Migrate analysis data (session)
        if (oldData.userData?.analysis) {
            newState.analysis = oldData.userData.analysis;
        } else if (oldData.lastAnalysis?.analysisText) {
            newState.analysisText = oldData.lastAnalysis.analysisText;
            newState.analysisTimestamp = oldData.lastAnalysis.timestamp;
        }

        // Migrate workflow state
        if (oldData.workflowState) {
            newState.currentStep = oldData.workflowState.currentStep || 1;
            newState.steps = oldData.workflowState.steps || {};
        }

        // Migrate progress indicators
        if (oldData.progress) {
            newState.progress = oldData.progress;
        }

        console.log('[StateMigration] Transformed to new format:', {
            hasApiKey: !!newState.apiKey,
            hasResume: !!newState.resumeText,
            hasJob: !!newState.jobDescription,
            hasAnalysis: !!(newState.analysis || newState.analysisText),
            currentStep: newState.currentStep
        });

        return newState;
    }

    /**
     * Apply migrated data to workflow state
     * @private
     * @param {Object} newState - New state data
     */
    applyToWorkflowState(newState) {
        if (!window.workflowState) {
            console.warn('[StateMigration] workflowState not available');
            return;
        }

        const updates = {};

        // API key (persistent)
        if (newState.apiKey) {
            updates['inputs.preferences.apiKey'] = newState.apiKey;
        }

        // Resume data (session)
        if (newState.resumeText) {
            updates['inputs.resume.text'] = newState.resumeText;
            updates['inputs.resume.uploadedAt'] = new Date().toISOString();
        }
        if (newState.resumeFileName) {
            updates['inputs.resume.fileName'] = newState.resumeFileName;
        }
        if (newState.resumeFormat) {
            updates['inputs.resume.format'] = newState.resumeFormat;
        }

        // Job data (session)
        if (newState.jobDescription) {
            updates['inputs.job.description'] = newState.jobDescription;
            updates['inputs.job.uploadedAt'] = new Date().toISOString();
        }
        if (newState.jobTitle) {
            updates['inputs.job.title'] = newState.jobTitle;
        }
        if (newState.jobCompany) {
            updates['inputs.job.company'] = newState.jobCompany;
        }
        if (newState.jobUrl) {
            updates['inputs.job.url'] = newState.jobUrl;
        }

        // Analysis data (session)
        if (newState.analysis) {
            Object.keys(newState.analysis).forEach(key => {
                updates[`analysis.${key}`] = newState.analysis[key];
            });
        } else if (newState.analysisText) {
            updates['analysis.timestamp'] = newState.analysisTimestamp || new Date().toISOString();
        }

        // Workflow state
        if (newState.currentStep) {
            updates['currentStep'] = newState.currentStep;
        }

        // Apply all updates
        if (Object.keys(updates).length > 0) {
            window.workflowState.update(updates);
            console.log('[StateMigration] Applied', Object.keys(updates).length, 'updates to workflow state');
        }
    }

    /**
     * Clean up old localStorage data after successful migration
     * @private
     */
    cleanupOldData() {
        const cleanedKeys = [];

        for (const key of this.OLD_KEYS) {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                cleanedKeys.push(key);
            }
        }

        if (cleanedKeys.length > 0) {
            console.log('[StateMigration] Cleaned up old keys:', cleanedKeys);
        }

        // Set migration flag to prevent re-migration
        localStorage.setItem('resumate_migration_completed', 'true');
    }

    /**
     * Check if migration has been completed before
     * @returns {boolean} True if already migrated
     */
    hasMigrated() {
        return localStorage.getItem('resumate_migration_completed') === 'true';
    }

    /**
     * Force re-run migration (for testing)
     */
    resetMigration() {
        localStorage.removeItem('resumate_migration_completed');
        this.migrated = false;
        console.log('[StateMigration] Migration reset');
    }

    /**
     * Run migration automatically if needed
     * Called on page load
     */
    autoMigrate() {
        if (this.hasMigrated()) {
            console.log('[StateMigration] Already migrated (skipping)');
            return { success: true, skipped: true };
        }

        if (!this.needsMigration()) {
            console.log('[StateMigration] No old data found (skipping)');
            localStorage.setItem('resumate_migration_completed', 'true');
            return { success: true, noDataToMigrate: true };
        }

        console.log('[StateMigration] Old data detected, starting auto-migration...');
        return this.migrate();
    }
}

// Create singleton instance
const stateMigration = new StateMigration();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateMigration;
}

// Add to window for global access
if (typeof window !== 'undefined') {
    window.StateMigration = StateMigration;
    window.stateMigration = stateMigration;
}

// Auto-run migration when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for workflowState to be available
        setTimeout(() => {
            stateMigration.autoMigrate();
        }, 100);
    });
} else {
    // DOM already loaded, run immediately
    setTimeout(() => {
        stateMigration.autoMigrate();
    }, 100);
}

console.log('[StateMigration] Module loaded and ready');

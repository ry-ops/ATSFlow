// Executive Bio Generator
// Handles AI-powered executive biography generation

/**
 * Executive Bio Generator Class
 * Manages AI generation of professional biographies
 */
class ExecutiveBioGenerator {
    constructor() {
        this.apiEndpoint = '/api/generate';
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.generationHistory = [];
    }

    /**
     * Get API key from localStorage
     * @returns {string} - API key
     * @private
     */
    _getApiKey() {
        const apiKey = localStorage.getItem('claude_api_key');
        if (!apiKey) {
            throw new Error('API key not found. Please set your Claude API key in settings.');
        }
        return apiKey;
    }

    /**
     * Make API request with retry logic
     * @param {string} prompt - Prompt to send to Claude
     * @param {Object} options - Additional options
     * @returns {Promise<string>} - Generated content
     * @private
     */
    async _makeRequest(prompt, options = {}) {
        const {
            maxTokens = 1024,
            temperature = 0.7,
            retryCount = 0
        } = options;

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    apiKey: this._getApiKey(),
                    maxTokens,
                    temperature
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data.content;
        } catch (error) {
            if (retryCount < this.maxRetries && this._isRetryableError(error)) {
                await this._delay(this.retryDelay * (retryCount + 1));
                return this._makeRequest(prompt, {
                    ...options,
                    retryCount: retryCount + 1
                });
            }
            throw error;
        }
    }

    /**
     * Check if error is retryable
     * @param {Error} error - Error object
     * @returns {boolean}
     * @private
     */
    _isRetryableError(error) {
        const retryableMessages = ['network', 'timeout', 'rate limit', 'overloaded'];
        const message = error.message.toLowerCase();
        return retryableMessages.some(msg => message.includes(msg));
    }

    /**
     * Delay helper for retries
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     * @private
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate executive bio
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated bio with metadata
     */
    async generate(params) {
        if (typeof CareerDocsPrompts === 'undefined') {
            throw new Error('CareerDocsPrompts module not loaded');
        }

        const {
            name,
            currentTitle,
            company,
            yearsExperience,
            achievements = [],
            expertise = [],
            education = '',
            style = 'executive',
            length = 100,
            perspective = 'third'
        } = params;

        // Validate required fields
        if (!name || !currentTitle) {
            throw new Error('Name and current title are required');
        }

        try {
            const prompt = CareerDocsPrompts.generateExecutiveBio({
                name,
                currentTitle,
                company,
                yearsExperience,
                achievements,
                expertise,
                education,
                style,
                length,
                perspective
            });

            const maxTokens = Math.max(512, length * 4);
            const content = await this._makeRequest(prompt, {
                maxTokens,
                temperature: 0.7
            });

            const generation = {
                id: this._generateId(),
                type: 'executive_bio',
                timestamp: new Date().toISOString(),
                params: { name, currentTitle, company, style, length, perspective },
                result: {
                    content,
                    wordCount: this._countWords(content)
                }
            };

            this.generationHistory.push(generation);
            this._saveHistory();

            return {
                success: true,
                content,
                metadata: {
                    wordCount: this._countWords(content),
                    generatedAt: generation.timestamp,
                    generationId: generation.id,
                    style,
                    length,
                    perspective
                }
            };
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Bio generation failed:', error);
            return {
                success: false,
                error: error.message,
                content: ''
            };
        }
    }

    /**
     * Generate multiple bio variations
     * @param {Object} params - Generation parameters
     * @param {number} count - Number of variations
     * @returns {Promise<Object>} - Array of generated bios
     */
    async generateVariations(params, count = 3) {
        const variations = [];

        for (let i = 0; i < count; i++) {
            const result = await this.generate({
                ...params,
                // Slightly vary temperature for diversity
            });
            if (result.success) {
                variations.push(result);
            }
        }

        return {
            success: variations.length > 0,
            variations,
            count: variations.length
        };
    }

    /**
     * Count words in text
     * @param {string} text - Text to count
     * @returns {number} - Word count
     * @private
     */
    _countWords(text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(w => w.length > 0).length;
    }

    /**
     * Generate unique ID
     * @returns {string} - Unique ID
     * @private
     */
    _generateId() {
        return 'bio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Save generation history to localStorage
     * @private
     */
    _saveHistory() {
        try {
            const recentHistory = this.generationHistory.slice(-20);
            localStorage.setItem('bio_history', JSON.stringify(recentHistory));
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Failed to save bio history:', error);
        }
    }

    /**
     * Load generation history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('bio_history');
            if (saved) {
                this.generationHistory = JSON.parse(saved);
            }
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Failed to load bio history:', error);
            this.generationHistory = [];
        }
    }

    /**
     * Get generation history
     * @returns {Array} - Generation history
     */
    getHistory() {
        return this.generationHistory;
    }

    /**
     * Clear generation history
     */
    clearHistory() {
        this.generationHistory = [];
        localStorage.removeItem('bio_history');
    }

    /**
     * Export bio to clipboard
     * @param {string} content - Bio content
     * @returns {Promise<boolean>} - Success status
     */
    async copyToClipboard(content) {
        try {
            await navigator.clipboard.writeText(content);
            return true;
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Clipboard copy failed:', error);
            return false;
        }
    }
}

// Create global instance
const executiveBioGenerator = new ExecutiveBioGenerator();

// Load history on initialization
if (typeof window !== 'undefined') {
    executiveBioGenerator.loadHistory();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExecutiveBioGenerator, executiveBioGenerator };
}

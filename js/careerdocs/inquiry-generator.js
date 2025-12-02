// Status Inquiry Letter Generator
// Handles AI-powered follow-up letter generation

/**
 * Status Inquiry Letter Generator Class
 * Manages AI generation of job application follow-up letters
 */
class StatusInquiryGenerator {
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
            maxTokens = 512,
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
     * Generate status inquiry letter
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated letter with metadata
     */
    async generate(params) {
        if (typeof CareerDocsPrompts === 'undefined') {
            throw new Error('CareerDocsPrompts module not loaded');
        }

        const {
            jobTitle,
            companyName,
            applicationDate,
            contactName = '',
            interviewDate = '',
            tone = 'professional',
            inquiryType = 'post-application',
            additionalContext = ''
        } = params;

        // Validate required fields
        if (!jobTitle || !companyName) {
            throw new Error('Job title and company name are required');
        }

        try {
            const prompt = CareerDocsPrompts.generateStatusInquiry({
                jobTitle,
                companyName,
                applicationDate,
                contactName,
                interviewDate,
                tone,
                inquiryType,
                additionalContext
            });

            const content = await this._makeRequest(prompt, {
                maxTokens: 512,
                temperature: 0.7
            });

            const generation = {
                id: this._generateId(),
                type: 'status_inquiry',
                timestamp: new Date().toISOString(),
                params: { jobTitle, companyName, tone, inquiryType },
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
                    inquiryType,
                    tone
                }
            };
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Inquiry generation failed:', error);
            return {
                success: false,
                error: error.message,
                content: ''
            };
        }
    }

    /**
     * Generate post-interview follow-up
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated letter
     */
    async generatePostInterview(params) {
        return this.generate({
            ...params,
            inquiryType: 'post-interview'
        });
    }

    /**
     * Generate post-application follow-up
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated letter
     */
    async generatePostApplication(params) {
        return this.generate({
            ...params,
            inquiryType: 'post-application'
        });
    }

    /**
     * Generate offer timeline inquiry
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated letter
     */
    async generateOfferTimeline(params) {
        return this.generate({
            ...params,
            inquiryType: 'offer-timeline'
        });
    }

    /**
     * Generate decision update request
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated letter
     */
    async generateDecisionUpdate(params) {
        return this.generate({
            ...params,
            inquiryType: 'decision-update'
        });
    }

    /**
     * Get suggested follow-up timing
     * @param {string} inquiryType - Type of inquiry
     * @param {string} applicationDate - Application date
     * @returns {Object} - Timing recommendations
     */
    getSuggestedTiming(inquiryType, applicationDate) {
        const timings = {
            'post-application': {
                firstFollowUp: '1-2 weeks after applying',
                secondFollowUp: '3-4 weeks after applying',
                advice: 'Wait at least one week before your first follow-up'
            },
            'post-interview': {
                firstFollowUp: '1 week after interview',
                secondFollowUp: '2 weeks after interview',
                advice: 'Send a thank-you note within 24 hours, then follow up after a week'
            },
            'offer-timeline': {
                firstFollowUp: 'After stated timeline passes',
                advice: 'Wait until their stated timeline has passed before inquiring'
            },
            'decision-update': {
                firstFollowUp: '1 week after expected decision date',
                advice: 'Be patient but persistent. One follow-up per week maximum'
            }
        };

        return timings[inquiryType] || timings['post-application'];
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
        return 'inq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Save generation history to localStorage
     * @private
     */
    _saveHistory() {
        try {
            const recentHistory = this.generationHistory.slice(-20);
            localStorage.setItem('inquiry_history', JSON.stringify(recentHistory));
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Failed to save inquiry history:', error);
        }
    }

    /**
     * Load generation history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('inquiry_history');
            if (saved) {
                this.generationHistory = JSON.parse(saved);
            }
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Failed to load inquiry history:', error);
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
        localStorage.removeItem('inquiry_history');
    }

    /**
     * Export letter to clipboard
     * @param {string} content - Letter content
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
const statusInquiryGenerator = new StatusInquiryGenerator();

// Load history on initialization
if (typeof window !== 'undefined') {
    statusInquiryGenerator.loadHistory();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatusInquiryGenerator, statusInquiryGenerator };
}

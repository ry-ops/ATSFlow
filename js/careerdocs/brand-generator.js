// Personal Brand Statement Generator
// Handles AI-powered personal brand statement generation

/**
 * Personal Brand Statement Generator Class
 * Manages AI generation of personal brand statements
 */
class BrandStatementGenerator {
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
            temperature = 0.8,
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
     * Generate personal brand statement
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated statement with metadata
     */
    async generate(params) {
        if (typeof CareerDocsPrompts === 'undefined') {
            throw new Error('CareerDocsPrompts module not loaded');
        }

        const {
            name,
            currentRole,
            targetRole = '',
            coreValues = [],
            expertise = [],
            differentiators = [],
            audience = 'recruiters',
            style = 'professional',
            length = 'elevator'
        } = params;

        // Validate required fields
        if (!name || !currentRole) {
            throw new Error('Name and current role are required');
        }

        try {
            const prompt = CareerDocsPrompts.generateBrandStatement({
                name,
                currentRole,
                targetRole,
                coreValues,
                expertise,
                differentiators,
                audience,
                style,
                length
            });

            const maxTokens = length === 'tagline' ? 64 : length === 'elevator' ? 256 : 512;
            const content = await this._makeRequest(prompt, {
                maxTokens,
                temperature: 0.8
            });

            const generation = {
                id: this._generateId(),
                type: 'brand_statement',
                timestamp: new Date().toISOString(),
                params: { name, currentRole, audience, style, length },
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
                    audience,
                    style,
                    length
                }
            };
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Brand statement generation failed:', error);
            return {
                success: false,
                error: error.message,
                content: ''
            };
        }
    }

    /**
     * Generate tagline (short headline)
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated tagline
     */
    async generateTagline(params) {
        return this.generate({
            ...params,
            length: 'tagline'
        });
    }

    /**
     * Generate elevator pitch
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated elevator pitch
     */
    async generateElevatorPitch(params) {
        return this.generate({
            ...params,
            length: 'elevator'
        });
    }

    /**
     * Generate full narrative
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - Generated full narrative
     */
    async generateFullNarrative(params) {
        return this.generate({
            ...params,
            length: 'full'
        });
    }

    /**
     * Generate all three lengths at once
     * @param {Object} params - Generation parameters
     * @returns {Promise<Object>} - All three versions
     */
    async generateAllLengths(params) {
        const [tagline, elevator, full] = await Promise.all([
            this.generateTagline(params),
            this.generateElevatorPitch(params),
            this.generateFullNarrative(params)
        ]);

        return {
            success: tagline.success || elevator.success || full.success,
            tagline,
            elevator,
            full
        };
    }

    /**
     * Analyze existing brand statement
     * @param {Object} params - Analysis parameters
     * @returns {Promise<Object>} - Analysis results
     */
    async analyze(params) {
        if (typeof CareerDocsPrompts === 'undefined') {
            throw new Error('CareerDocsPrompts module not loaded');
        }

        const { statement, targetAudience = 'recruiters' } = params;

        if (!statement || statement.trim().length === 0) {
            throw new Error('Brand statement text is required');
        }

        try {
            const prompt = CareerDocsPrompts.analyzeBrandStatement({
                statement,
                targetAudience
            });

            const content = await this._makeRequest(prompt, {
                maxTokens: 1024,
                temperature: 0.5
            });

            // Parse JSON response
            let analysis;
            try {
                const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                analysis = JSON.parse(cleanedContent);
            } catch (parseError) {
                if (typeof logger !== 'undefined') logger.error('Failed to parse analysis JSON:', parseError);
                throw new Error('Failed to parse analysis results');
            }

            return {
                success: true,
                analysis,
                metadata: {
                    analyzedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Brand analysis failed:', error);
            return {
                success: false,
                error: error.message,
                analysis: null
            };
        }
    }

    /**
     * Get brand statement templates
     * @returns {Object} - Template examples
     */
    getTemplates() {
        return {
            tagline: [
                'Helping [target audience] achieve [specific outcome] through [your unique approach]',
                '[Your specialty] expert who [key differentiator]',
                'Transforming [problem] into [solution] for [industry]'
            ],
            elevator: [
                'I help [target audience] [achieve outcome] by [method/approach]. With [X years/credentials], I bring [unique value] that results in [measurable impact].',
                'As a [role], I [primary function] that [benefit to organization]. My approach combines [skill 1] and [skill 2] to deliver [specific results].'
            ],
            full: [
                'Opening: Hook with your unique perspective or mission\nBody: Your expertise, track record, and approach\nClosing: Vision for impact and call to action'
            ]
        };
    }

    /**
     * Get suggested core values by industry
     * @param {string} industry - Industry name
     * @returns {string[]} - Suggested values
     */
    getSuggestedValues(industry) {
        const valuesByIndustry = {
            technology: ['Innovation', 'Continuous Learning', 'Problem-Solving', 'User-Centric', 'Collaboration'],
            finance: ['Integrity', 'Precision', 'Risk Management', 'Client Focus', 'Results-Driven'],
            healthcare: ['Compassion', 'Excellence', 'Patient-Centered', 'Innovation', 'Integrity'],
            marketing: ['Creativity', 'Data-Driven', 'Storytelling', 'Customer Insight', 'Adaptability'],
            consulting: ['Strategic Thinking', 'Client Success', 'Expertise', 'Integrity', 'Impact'],
            default: ['Excellence', 'Integrity', 'Innovation', 'Collaboration', 'Growth']
        };

        return valuesByIndustry[industry.toLowerCase()] || valuesByIndustry.default;
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
        return 'brand_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Save generation history to localStorage
     * @private
     */
    _saveHistory() {
        try {
            const recentHistory = this.generationHistory.slice(-20);
            localStorage.setItem('brand_history', JSON.stringify(recentHistory));
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Failed to save brand history:', error);
        }
    }

    /**
     * Load generation history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('brand_history');
            if (saved) {
                this.generationHistory = JSON.parse(saved);
            }
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Failed to load brand history:', error);
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
        localStorage.removeItem('brand_history');
    }

    /**
     * Export statement to clipboard
     * @param {string} content - Statement content
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
const brandStatementGenerator = new BrandStatementGenerator();

// Load history on initialization
if (typeof window !== 'undefined') {
    brandStatementGenerator.loadHistory();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BrandStatementGenerator, brandStatementGenerator };
}

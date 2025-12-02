// AI Content Generator
// Handles API calls to Claude for content generation

/**
 * AI Content Generator Class
 * Manages API communication with Claude for resume content generation
 */
class AIGenerator {
    constructor() {
        this.apiEndpoint = '/api/generate';
        this.maxRetries = 3;
        this.retryDelay = 1000; // ms
    }

    /**
     * Get API key from localStorage
     * @returns {string} - API key
     * @private
     */
    _getApiKey() {
        const apiKey = localStorage.getItem('claude_api_key');
        if (!apiKey) {
            throw new Error('API key not found. Please set your Claude API key.');
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
            // Retry logic for network errors
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
        const retryableMessages = [
            'network',
            'timeout',
            'rate limit',
            'overloaded'
        ];
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
     * Generate professional summary
     * @param {Object} params - Summary generation parameters
     * @returns {Promise<string>} - Generated summary
     */
    async generateSummary(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.generateSummary(params);
        return this._makeRequest(prompt, { maxTokens: 512, temperature: 0.7 });
    }

    /**
     * Expand a bullet point
     * @param {Object} params - Bullet expansion parameters
     * @returns {Promise<string[]>} - Array of expanded bullet variations
     */
    async expandBullet(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.expandBullet(params);
        const content = await this._makeRequest(prompt, { maxTokens: 512, temperature: 0.8 });

        // Parse bullet points from response
        return this._parseBulletPoints(content);
    }

    /**
     * Suggest action verbs
     * @param {Object} params - Action verb parameters
     * @returns {Promise<string[]>} - Array of action verbs
     */
    async suggestActionVerbs(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.suggestActionVerbs(params);
        const content = await this._makeRequest(prompt, { maxTokens: 256, temperature: 0.6 });

        // Parse comma-separated list
        return content
            .split(',')
            .map(verb => verb.trim())
            .filter(verb => verb.length > 0);
    }

    /**
     * Quantify an achievement
     * @param {Object} params - Quantification parameters
     * @returns {Promise<string[]>} - Array of quantified versions
     */
    async quantifyAchievement(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.quantifyAchievement(params);
        const content = await this._makeRequest(prompt, { maxTokens: 512, temperature: 0.7 });

        return this._parseBulletPoints(content);
    }

    /**
     * Rewrite content for a specific industry
     * @param {Object} params - Industry rewrite parameters
     * @returns {Promise<string>} - Rewritten content
     */
    async rewriteForIndustry(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.rewriteForIndustry(params);
        return this._makeRequest(prompt, { maxTokens: 512, temperature: 0.7 });
    }

    /**
     * Strengthen language in content
     * @param {Object} params - Language strengthening parameters
     * @returns {Promise<Object>} - Object with conservative and bold versions
     */
    async strengthenLanguage(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.strengthenLanguage(params);
        const content = await this._makeRequest(prompt, { maxTokens: 512, temperature: 0.8 });

        // Parse versions
        const versions = this._parseVersions(content);
        return {
            conservative: versions[0] || content,
            bold: versions[1] || content
        };
    }

    /**
     * Generate ATS keywords
     * @param {Object} params - Keyword generation parameters
     * @returns {Promise<Object>} - Categorized keywords
     */
    async generateKeywords(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.generateKeywords(params);
        const content = await this._makeRequest(prompt, { maxTokens: 1024, temperature: 0.6 });

        return this._parseKeywords(content);
    }

    /**
     * Generate bullet points from responsibilities
     * @param {Object} params - Bullet generation parameters
     * @returns {Promise<string[]>} - Array of bullet points
     */
    async generateBullets(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.generateBullets(params);
        const content = await this._makeRequest(prompt, { maxTokens: 768, temperature: 0.7 });

        return this._parseBulletPoints(content);
    }

    /**
     * Optimize content for ATS
     * @param {Object} params - ATS optimization parameters
     * @returns {Promise<Object>} - Object with balanced and keyword-focused versions
     */
    async optimizeForATS(params) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.optimizeForATS(params);
        const content = await this._makeRequest(prompt, { maxTokens: 512, temperature: 0.7 });

        const versions = this._parseVersions(content);
        return {
            balanced: versions[0] || content,
            keywordFocused: versions[1] || content
        };
    }

    /**
     * Parse bullet points from response
     * @param {string} content - Content to parse
     * @returns {string[]} - Array of bullet points
     * @private
     */
    _parseBulletPoints(content) {
        const lines = content.split('\n');
        const bullets = [];

        for (const line of lines) {
            const trimmed = line.trim();
            // Match lines starting with -, *, or numbers
            if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+[\.)]\s+/)) {
                const bullet = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+[\.)]\s+/, '');
                if (bullet.length > 0) {
                    bullets.push(bullet);
                }
            }
        }

        return bullets.length > 0 ? bullets : [content.trim()];
    }

    /**
     * Parse numbered versions from response
     * @param {string} content - Content to parse
     * @returns {string[]} - Array of versions
     * @private
     */
    _parseVersions(content) {
        const versions = [];
        const lines = content.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            // Match "1:" or "Version 1:" style prefixes
            const match = trimmed.match(/^(?:Version\s+)?(\d+):\s*(.+)$/i);
            if (match) {
                versions.push(match[2].trim());
            }
        }

        return versions.length > 0 ? versions : [content.trim()];
    }

    /**
     * Parse categorized keywords from response
     * @param {string} content - Content to parse
     * @returns {Object} - Categorized keywords
     * @private
     */
    _parseKeywords(content) {
        const result = {
            technicalSkills: [],
            softSkills: [],
            toolsTechnologies: [],
            missingKeywords: []
        };

        const lines = content.split('\n');
        let currentCategory = null;

        for (const line of lines) {
            const trimmed = line.trim();

            // Detect category headers
            if (trimmed.match(/^TECHNICAL SKILLS:/i)) {
                currentCategory = 'technicalSkills';
                const keywords = trimmed.replace(/^TECHNICAL SKILLS:/i, '').trim();
                if (keywords) {
                    result.technicalSkills = this._parseCommaSeparated(keywords);
                }
            } else if (trimmed.match(/^SOFT SKILLS:/i)) {
                currentCategory = 'softSkills';
                const keywords = trimmed.replace(/^SOFT SKILLS:/i, '').trim();
                if (keywords) {
                    result.softSkills = this._parseCommaSeparated(keywords);
                }
            } else if (trimmed.match(/^TOOLS?\s*(&|AND)?\s*TECHNOLOGIES:/i)) {
                currentCategory = 'toolsTechnologies';
                const keywords = trimmed.replace(/^TOOLS?\s*(&|AND)?\s*TECHNOLOGIES:/i, '').trim();
                if (keywords) {
                    result.toolsTechnologies = this._parseCommaSeparated(keywords);
                }
            } else if (trimmed.match(/^MISSING KEYWORDS:/i)) {
                currentCategory = 'missingKeywords';
                const keywords = trimmed.replace(/^MISSING KEYWORDS:/i, '').trim();
                if (keywords) {
                    result.missingKeywords = this._parseCommaSeparated(keywords);
                }
            } else if (currentCategory && trimmed.length > 0) {
                // Continue parsing keywords for current category
                result[currentCategory] = result[currentCategory].concat(
                    this._parseCommaSeparated(trimmed)
                );
            }
        }

        return result;
    }

    /**
     * Parse comma-separated values
     * @param {string} text - Text to parse
     * @returns {string[]} - Array of values
     * @private
     */
    _parseCommaSeparated(text) {
        return text
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }

    /**
     * Analyze resume against industry benchmarks (AI-powered)
     * @param {Object} resumeData - Resume data
     * @param {string} targetRole - Target role
     * @param {string} industry - Target industry
     * @returns {Promise<Object>} - Benchmark analysis
     */
    async analyzeBenchmark(resumeData, targetRole, industry) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        // Extract relevant data from resume
        const currentTitle = resumeData.title || resumeData.currentRole || '';
        const yearsExperience = this._calculateYearsExperience(resumeData.experience || []);
        const skills = this._extractSkills(resumeData);
        const education = this._formatEducation(resumeData.education || []);
        const resumeSummary = resumeData.summary || '';

        const prompt = AIPrompts.analyzeBenchmark({
            currentTitle,
            targetRole,
            industry,
            yearsExperience,
            skills,
            education,
            resumeSummary
        });

        const content = await this._makeRequest(prompt, {
            maxTokens: 2048,
            temperature: 0.6
        });

        // Parse JSON response
        return this._parseJSON(content);
    }

    /**
     * Generate career progression suggestions (AI-powered)
     * @param {Object} background - Professional background
     * @returns {Promise<Object>} - Career progression paths
     */
    async suggestCareerProgression(background) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const {
            currentRole,
            yearsExperience = 0,
            skills = [],
            industry,
            education = ''
        } = background;

        const prompt = AIPrompts.careerProgression({
            currentRole,
            yearsExperience,
            skills,
            industry,
            education
        });

        const content = await this._makeRequest(prompt, {
            maxTokens: 3072,
            temperature: 0.7
        });

        return this._parseJSON(content);
    }

    /**
     * Analyze skills gap for career transition (AI-powered)
     * @param {string[]} currentSkills - Current skills
     * @param {string} currentRole - Current role
     * @param {string} targetRole - Target role
     * @param {string} industry - Target industry
     * @returns {Promise<Object>} - Skills gap analysis
     */
    async analyzeSkillsGap(currentSkills, currentRole, targetRole, industry) {
        if (typeof AIPrompts === 'undefined') {
            throw new Error('AIPrompts module not loaded');
        }

        const prompt = AIPrompts.skillsGapAnalysis({
            currentSkills,
            currentRole,
            targetRole,
            industry
        });

        const content = await this._makeRequest(prompt, {
            maxTokens: 3072,
            temperature: 0.6
        });

        return this._parseJSON(content);
    }

    /**
     * Calculate years of experience from work history
     * @param {Array} experienceArray - Experience items
     * @returns {number} - Years of experience
     * @private
     */
    _calculateYearsExperience(experienceArray) {
        if (!experienceArray || experienceArray.length === 0) return 0;

        let totalMonths = 0;
        const now = new Date();

        experienceArray.forEach(exp => {
            const startDate = exp.startDate ? new Date(exp.startDate) : null;
            const endDate = exp.current ? now : (exp.endDate ? new Date(exp.endDate) : now);

            if (startDate && endDate) {
                const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                              (endDate.getMonth() - startDate.getMonth());
                totalMonths += Math.max(0, months);
            }
        });

        return Math.floor(totalMonths / 12);
    }

    /**
     * Extract skills from resume data
     * @param {Object} resumeData - Resume data
     * @returns {string[]} - Array of skills
     * @private
     */
    _extractSkills(resumeData) {
        const skills = [];

        if (resumeData.skills) {
            resumeData.skills.forEach(skill => {
                if (typeof skill === 'string') {
                    skills.push(skill);
                } else if (skill.name) {
                    skills.push(skill.name);
                }
            });
        }

        return skills;
    }

    /**
     * Format education for prompt
     * @param {Array} educationArray - Education items
     * @returns {string} - Formatted education
     * @private
     */
    _formatEducation(educationArray) {
        if (!educationArray || educationArray.length === 0) return 'Not specified';

        return educationArray
            .map(edu => {
                const degree = edu.degree || '';
                const field = edu.field || '';
                const school = edu.school || '';
                return `${degree} ${field} from ${school}`.trim();
            })
            .join('; ');
    }

    /**
     * Parse JSON from AI response
     * @param {string} content - Content to parse
     * @returns {Object} - Parsed JSON
     * @private
     */
    _parseJSON(content) {
        try {
            // Remove markdown code blocks if present
            let cleaned = content.trim();
            cleaned = cleaned.replace(/```json\s*/g, '');
            cleaned = cleaned.replace(/```\s*/g, '');
            cleaned = cleaned.trim();

            // Remove any leading/trailing text before first { and after last }
            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1) {
                cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }

            return JSON.parse(cleaned);
        } catch (error) {
            if (typeof logger !== 'undefined') logger.error('Failed to parse JSON:', error);
            if (typeof logger !== 'undefined') logger.error('Content:', content);
            throw new Error('Failed to parse AI response as JSON: ' + error.message);
        }
    }
}

// Create global instance
const aiGenerator = new AIGenerator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIGenerator, aiGenerator };
}

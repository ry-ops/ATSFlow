/**
 * LinkedIn Job Search Component
 * Searches LinkedIn jobs using the linkedin-jobs-api
 */

class LinkedInJobSearch {
    constructor() {
        this.apiEndpoint = '/api/linkedin-search';
        this.isSearching = false;
        this.searchResults = [];
        this.currentPage = 1;
        this.resultsPerPage = 10;
    }

    /**
     * Initialize the search component
     */
    initialize(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn('[LinkedInSearch] Container not found:', containerId);
            return;
        }

        this.render();
        this.attachEventListeners();
        console.log('[LinkedInSearch] Initialized');
    }

    /**
     * Render the search UI
     */
    render() {
        this.container.innerHTML = `
            <div class="linkedin-search-wrapper">
                <div class="linkedin-search-header">
                    <h3>
                        <span class="linkedin-icon">in</span>
                        Search LinkedIn Jobs
                    </h3>
                    <p>Find job postings directly from LinkedIn</p>
                </div>

                <div class="linkedin-search-form">
                    <div class="search-row">
                        <div class="search-field">
                            <label for="linkedin-keyword">Job Title / Keywords *</label>
                            <input type="text" id="linkedin-keyword" placeholder="e.g., Software Engineer, Marketing Manager">
                        </div>
                        <div class="search-field">
                            <label for="linkedin-location">Location</label>
                            <input type="text" id="linkedin-location" placeholder="e.g., San Francisco, CA">
                        </div>
                    </div>

                    <div class="search-filters">
                        <button class="filter-toggle" onclick="linkedInJobSearch.toggleFilters()">
                            <span class="filter-icon">⚙️</span> Advanced Filters
                            <span class="filter-arrow">▼</span>
                        </button>

                        <div class="filters-panel" id="linkedin-filters" style="display: none;">
                            <div class="filter-row">
                                <div class="filter-field">
                                    <label for="linkedin-date">Date Posted</label>
                                    <select id="linkedin-date">
                                        <option value="past month">Past Month</option>
                                        <option value="past week">Past Week</option>
                                        <option value="past 24 hours">Past 24 Hours</option>
                                    </select>
                                </div>
                                <div class="filter-field">
                                    <label for="linkedin-jobtype">Job Type</label>
                                    <select id="linkedin-jobtype">
                                        <option value="">Any</option>
                                        <option value="full time">Full Time</option>
                                        <option value="part time">Part Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                            </div>
                            <div class="filter-row">
                                <div class="filter-field">
                                    <label for="linkedin-remote">Work Type</label>
                                    <select id="linkedin-remote">
                                        <option value="">Any</option>
                                        <option value="remote">Remote</option>
                                        <option value="on-site">On-site</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div class="filter-field">
                                    <label for="linkedin-experience">Experience Level</label>
                                    <select id="linkedin-experience">
                                        <option value="">Any</option>
                                        <option value="entry level">Entry Level</option>
                                        <option value="associate">Associate</option>
                                        <option value="mid senior level">Mid-Senior Level</option>
                                        <option value="director">Director</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button class="linkedin-search-btn" id="linkedin-search-btn" onclick="linkedInJobSearch.search()">
                        <span class="search-icon">🔍</span>
                        Search Jobs
                    </button>
                </div>

                <div class="linkedin-results" id="linkedin-results" style="display: none;">
                    <div class="results-header">
                        <span class="results-count" id="linkedin-results-count">0 jobs found</span>
                        <button class="clear-results" onclick="linkedInJobSearch.clearResults()">Clear</button>
                    </div>
                    <div class="results-list" id="linkedin-results-list"></div>
                    <div class="results-pagination" id="linkedin-pagination"></div>
                </div>

                <div class="linkedin-loading" id="linkedin-loading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>Searching LinkedIn jobs...</p>
                </div>

                <div class="linkedin-error" id="linkedin-error" style="display: none;"></div>
            </div>
        `;

        this.attachStyles();
    }

    /**
     * Attach CSS styles
     */
    attachStyles() {
        if (document.getElementById('linkedin-search-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'linkedin-search-styles';
        styles.textContent = `
            .linkedin-search-wrapper {
                background: var(--card-bg, white);
                border-radius: 12px;
                padding: 24px;
                margin: 20px 0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }

            .linkedin-search-header {
                margin-bottom: 20px;
            }

            .linkedin-search-header h3 {
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 0 0 8px;
                color: var(--text-color, #333);
                font-size: 1.3em;
            }

            .linkedin-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                background: #0077b5;
                color: white;
                border-radius: 4px;
                font-weight: 700;
                font-size: 14px;
            }

            .linkedin-search-header p {
                margin: 0;
                color: var(--text-muted, #666);
                font-size: 0.9em;
            }

            .linkedin-search-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .search-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            @media (max-width: 600px) {
                .search-row {
                    grid-template-columns: 1fr;
                }
            }

            .search-field label,
            .filter-field label {
                display: block;
                margin-bottom: 6px;
                font-size: 0.9em;
                font-weight: 500;
                color: var(--text-color, #333);
            }

            .search-field input,
            .filter-field select {
                width: 100%;
                padding: 12px 14px;
                border: 2px solid var(--border-color, #e0e0e0);
                border-radius: 8px;
                font-size: 1em;
                background: var(--input-bg, white);
                color: var(--text-color, #333);
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .search-field input:focus,
            .filter-field select:focus {
                outline: none;
                border-color: #0077b5;
                box-shadow: 0 0 0 3px rgba(0,119,181,0.1);
            }

            .search-filters {
                border-top: 1px solid var(--border-color, #e0e0e0);
                padding-top: 16px;
            }

            .filter-toggle {
                display: flex;
                align-items: center;
                gap: 8px;
                background: none;
                border: none;
                color: var(--text-muted, #666);
                font-size: 0.9em;
                cursor: pointer;
                padding: 8px 0;
            }

            .filter-toggle:hover {
                color: #0077b5;
            }

            .filter-arrow {
                transition: transform 0.2s;
            }

            .filter-toggle.open .filter-arrow {
                transform: rotate(180deg);
            }

            .filters-panel {
                padding: 16px 0;
            }

            .filter-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-bottom: 12px;
            }

            @media (max-width: 600px) {
                .filter-row {
                    grid-template-columns: 1fr;
                }
            }

            .linkedin-search-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 14px 28px;
                background: linear-gradient(135deg, #0077b5, #005885);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.1em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .linkedin-search-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0,119,181,0.3);
            }

            .linkedin-search-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            .linkedin-results {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid var(--border-color, #e0e0e0);
            }

            .results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .results-count {
                font-weight: 600;
                color: var(--text-color, #333);
            }

            .clear-results {
                background: none;
                border: 1px solid var(--border-color, #e0e0e0);
                padding: 6px 12px;
                border-radius: 6px;
                color: var(--text-muted, #666);
                cursor: pointer;
                font-size: 0.85em;
            }

            .clear-results:hover {
                background: var(--bg-color, #f5f5f5);
            }

            .results-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .job-card {
                background: var(--bg-color, #f8f9fa);
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 10px;
                padding: 16px;
                transition: all 0.2s;
            }

            .job-card:hover {
                border-color: #0077b5;
                box-shadow: 0 4px 12px rgba(0,119,181,0.1);
            }

            .job-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 10px;
            }

            .job-title {
                font-size: 1.1em;
                font-weight: 600;
                color: #0077b5;
                margin: 0 0 4px;
            }

            .job-company {
                font-size: 0.95em;
                color: var(--text-color, #333);
                margin: 0;
            }

            .job-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                font-size: 0.85em;
                color: var(--text-muted, #666);
                margin-bottom: 10px;
            }

            .job-meta span {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .job-description {
                font-size: 0.9em;
                color: var(--text-muted, #666);
                line-height: 1.5;
                margin-bottom: 12px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .job-actions {
                display: flex;
                gap: 10px;
            }

            .job-action-btn {
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 0.85em;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .job-action-btn.primary {
                background: #0077b5;
                color: white;
                border: none;
            }

            .job-action-btn.primary:hover {
                background: #005885;
            }

            .job-action-btn.secondary {
                background: none;
                color: #0077b5;
                border: 1px solid #0077b5;
            }

            .job-action-btn.secondary:hover {
                background: rgba(0,119,181,0.1);
            }

            .linkedin-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 40px;
                color: var(--text-muted, #666);
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid var(--border-color, #e0e0e0);
                border-top-color: #0077b5;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .linkedin-error {
                background: #fee2e2;
                color: #dc2626;
                padding: 16px;
                border-radius: 8px;
                margin-top: 16px;
            }

            .results-pagination {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 20px;
            }

            .pagination-btn {
                padding: 8px 14px;
                border: 1px solid var(--border-color, #e0e0e0);
                background: var(--card-bg, white);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .pagination-btn:hover {
                border-color: #0077b5;
            }

            .pagination-btn.active {
                background: #0077b5;
                color: white;
                border-color: #0077b5;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const keywordInput = document.getElementById('linkedin-keyword');
        if (keywordInput) {
            keywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.search();
                }
            });
        }
    }

    /**
     * Toggle advanced filters
     */
    toggleFilters() {
        const filtersPanel = document.getElementById('linkedin-filters');
        const toggleBtn = document.querySelector('.filter-toggle');

        if (filtersPanel.style.display === 'none') {
            filtersPanel.style.display = 'block';
            toggleBtn.classList.add('open');
        } else {
            filtersPanel.style.display = 'none';
            toggleBtn.classList.remove('open');
        }
    }

    /**
     * Search for jobs
     */
    async search() {
        if (this.isSearching) return;

        const keyword = document.getElementById('linkedin-keyword')?.value.trim();
        const location = document.getElementById('linkedin-location')?.value.trim();

        if (!keyword || keyword.length < 2) {
            this.showError('Please enter a job title or keyword (minimum 2 characters)');
            return;
        }

        this.isSearching = true;
        this.showLoading(true);
        this.hideError();

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keyword,
                    location,
                    dateSincePosted: document.getElementById('linkedin-date')?.value,
                    jobType: document.getElementById('linkedin-jobtype')?.value,
                    remoteFilter: document.getElementById('linkedin-remote')?.value,
                    experienceLevel: document.getElementById('linkedin-experience')?.value,
                    limit: '25'
                })
            });

            const data = await response.json();

            if (data.success) {
                this.searchResults = data.jobs;
                this.currentPage = 1;
                this.displayResults();
            } else {
                this.showError(data.error || 'Search failed');
            }
        } catch (error) {
            console.error('[LinkedInSearch] Error:', error);
            this.showError('Failed to search jobs. Please try again.');
        } finally {
            this.isSearching = false;
            this.showLoading(false);
        }
    }

    /**
     * Display search results
     */
    displayResults() {
        const resultsContainer = document.getElementById('linkedin-results');
        const resultsCount = document.getElementById('linkedin-results-count');
        const resultsList = document.getElementById('linkedin-results-list');

        if (!this.searchResults || this.searchResults.length === 0) {
            resultsContainer.style.display = 'none';
            this.showError('No jobs found. Try different keywords or filters.');
            return;
        }

        resultsContainer.style.display = 'block';
        resultsCount.textContent = `${this.searchResults.length} jobs found`;

        // Calculate pagination
        const start = (this.currentPage - 1) * this.resultsPerPage;
        const end = start + this.resultsPerPage;
        const pageResults = this.searchResults.slice(start, end);

        resultsList.innerHTML = pageResults.map((job, index) => `
            <div class="job-card">
                <div class="job-card-header">
                    <div>
                        <h4 class="job-title">${this.escapeHtml(job.position)}</h4>
                        <p class="job-company">${this.escapeHtml(job.company)}</p>
                    </div>
                </div>
                <div class="job-meta">
                    ${job.location ? `<span>📍 ${this.escapeHtml(job.location)}</span>` : ''}
                    ${job.date ? `<span>📅 ${this.escapeHtml(job.date)}</span>` : ''}
                    ${job.salary ? `<span>💰 ${this.escapeHtml(job.salary)}</span>` : ''}
                </div>
                ${job.description ? `<p class="job-description">${this.escapeHtml(job.description)}</p>` : ''}
                <div class="job-actions">
                    <button class="job-action-btn primary" onclick="linkedInJobSearch.useJob(${start + index})">
                        Use This Job
                    </button>
                    ${job.jobUrl ? `<a href="${this.escapeHtml(job.jobUrl)}" target="_blank" class="job-action-btn secondary">View on LinkedIn</a>` : ''}
                </div>
            </div>
        `).join('');

        this.renderPagination();
    }

    /**
     * Render pagination
     */
    renderPagination() {
        const totalPages = Math.ceil(this.searchResults.length / this.resultsPerPage);
        const pagination = document.getElementById('linkedin-pagination');

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="linkedInJobSearch.goToPage(${i})">${i}</button>`;
        }
        pagination.innerHTML = html;
    }

    /**
     * Go to page
     */
    goToPage(page) {
        this.currentPage = page;
        this.displayResults();
        document.getElementById('linkedin-results')?.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Use selected job
     */
    useJob(index) {
        const job = this.searchResults[index];
        if (!job) return;

        // Fill job data into forms
        if (job.position) {
            const inquiryJobTitle = document.getElementById('inquiry-job-title');
            const brandTarget = document.getElementById('brand-target');
            const bioTitle = document.getElementById('bio-title');

            if (inquiryJobTitle) inquiryJobTitle.value = job.position;
            if (brandTarget) brandTarget.value = job.position;
            if (bioTitle && !bioTitle.value) bioTitle.value = job.position;
        }

        if (job.company) {
            const inquiryCompany = document.getElementById('inquiry-company');
            if (inquiryCompany) inquiryCompany.value = job.company;
        }

        // Store for use in job import
        if (typeof currentJobData !== 'undefined') {
            window.currentJobData = {
                success: true,
                source: { type: 'linkedin-search', url: job.jobUrl },
                parsed: {
                    jobTitle: job.position,
                    company: job.company,
                    location: job.location,
                    salaryRange: job.salary
                }
            };
        }

        alert(`Job selected: ${job.position} at ${job.company}\n\nRelevant fields have been auto-filled.`);

        // Switch to Status Inquiry tab
        if (typeof switchTab === 'function') {
            switchTab('inquiry');
        }
    }

    /**
     * Clear results
     */
    clearResults() {
        this.searchResults = [];
        document.getElementById('linkedin-results').style.display = 'none';
        document.getElementById('linkedin-keyword').value = '';
        document.getElementById('linkedin-location').value = '';
    }

    /**
     * Show/hide loading
     */
    showLoading(show) {
        const loading = document.getElementById('linkedin-loading');
        const btn = document.getElementById('linkedin-search-btn');

        if (loading) loading.style.display = show ? 'flex' : 'none';
        if (btn) btn.disabled = show;
    }

    /**
     * Show error
     */
    showError(message) {
        const errorEl = document.getElementById('linkedin-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    /**
     * Hide error
     */
    hideError() {
        const errorEl = document.getElementById('linkedin-error');
        if (errorEl) errorEl.style.display = 'none';
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
const linkedInJobSearch = new LinkedInJobSearch();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LinkedInJobSearch, linkedInJobSearch };
}

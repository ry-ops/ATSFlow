/**
 * Job Description Indicator
 * Real-time visual feedback for job description status
 */

class JobIndicator {
  constructor() {
    this.indicator = null;
    this.hasJob = false;
  }

  /**
   * Initialize indicator
   */
  initialize() {
    this.createIndicator();
    this.attachListeners();
    console.log('[JobIndicator] Initialized');
  }

  /**
   * Create indicator UI
   */
  createIndicator() {
    // Find job description section
    const jobSection = document.querySelector('#step-tailor, .card:has(#job-text)');
    if (!jobSection) {
      console.warn('[JobIndicator] Job description section not found');
      return;
    }

    // Create indicator element
    this.indicator = document.createElement('div');
    this.indicator.className = 'job-indicator';
    this.indicator.innerHTML = `
      <div class="job-indicator-icon">
        <span class="icon-empty">⭕</span>
        <span class="icon-filled">✓</span>
      </div>
      <div class="job-indicator-text">
        <span class="text-empty">No job description</span>
        <span class="text-filled">Job description added</span>
      </div>
    `;

    // Add to header
    const header = jobSection.querySelector('h2, .step-header');
    if (header) {
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.gap = '12px';
      header.style.flexWrap = 'wrap';
      header.appendChild(this.indicator);
    }

    // Add styles
    this.addStyles();
  }

  /**
   * Add indicator styles
   */
  addStyles() {
    if (document.getElementById('job-indicator-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'job-indicator-styles';
    styles.textContent = `
      .job-indicator {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: #f3f4f6;
        border-radius: 999px;
        border: 2px solid #e5e7eb;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 14px;
        font-weight: 500;
        margin-left: auto;
      }

      .job-indicator-icon {
        position: relative;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .job-indicator-icon .icon-empty,
      .job-indicator-icon .icon-filled {
        position: absolute;
        transition: all 0.3s ease;
      }

      .job-indicator-icon .icon-empty {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }

      .job-indicator-icon .icon-filled {
        opacity: 0;
        transform: scale(0) rotate(180deg);
      }

      .job-indicator.has-job .icon-empty {
        opacity: 0;
        transform: scale(0) rotate(-180deg);
      }

      .job-indicator.has-job .icon-filled {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }

      .job-indicator-text {
        position: relative;
        min-width: 140px;
      }

      .job-indicator-text .text-empty,
      .job-indicator-text .text-filled {
        transition: all 0.3s ease;
      }

      .job-indicator-text .text-empty {
        opacity: 1;
        color: #9ca3af;
      }

      .job-indicator-text .text-filled {
        position: absolute;
        left: 0;
        opacity: 0;
        color: #10b981;
        font-weight: 600;
      }

      .job-indicator.has-job {
        background: #f0fdf4;
        border-color: #10b981;
        animation: successPulse 0.5s ease-out;
      }

      .job-indicator.has-job .text-empty {
        opacity: 0;
      }

      .job-indicator.has-job .text-filled {
        opacity: 1;
      }

      @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      /* Dark theme support */
      [data-theme="dark"] .job-indicator {
        background: #2d3436;
        border-color: #34495e;
      }

      [data-theme="dark"] .job-indicator.has-job {
        background: #1e3a2e;
        border-color: #10b981;
      }

      [data-theme="dark"] .job-indicator-text .text-empty {
        color: #636e72;
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Attach event listeners
   */
  attachListeners() {
    // Text input
    const jobText = document.getElementById('job-text');
    if (jobText) {
      jobText.addEventListener('input', () => {
        this.checkJobStatus();
      });

      // Check initial value
      if (jobText.value.length > 50) {
        this.setHasJob(true);
      }
    }

    // URL input
    const jobUrl = document.getElementById('job-url');
    if (jobUrl) {
      jobUrl.addEventListener('input', () => {
        this.checkJobStatus();
      });

      // Check initial value
      if (jobUrl.value.length > 10) {
        this.setHasJob(true);
      }
    }

    // File upload
    const jobFile = document.getElementById('job-file');
    if (jobFile) {
      jobFile.addEventListener('change', () => {
        if (jobFile.files.length > 0) {
          this.setHasJob(true);
        }
      });
    }

    // Import button (URL)
    const importBtn = document.getElementById('import-job-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        // Wait a bit for the import to complete
        setTimeout(() => this.checkJobStatus(), 1000);
      });
    }
  }

  /**
   * Check job description status
   */
  checkJobStatus() {
    const jobText = document.getElementById('job-text');
    const jobUrl = document.getElementById('job-url');

    const hasText = jobText && jobText.value.length > 50;
    const hasUrl = jobUrl && jobUrl.value.length > 10;

    this.setHasJob(hasText || hasUrl);
  }

  /**
   * Update indicator status
   */
  setHasJob(hasJob) {
    if (this.hasJob === hasJob) return;

    this.hasJob = hasJob;

    if (this.indicator) {
      if (hasJob) {
        this.indicator.classList.add('has-job');
      } else {
        this.indicator.classList.remove('has-job');
      }
    }

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('jobStatusChanged', {
      detail: { hasJob }
    }));

    console.log('[JobIndicator] Status updated:', hasJob ? 'Has job' : 'No job');
  }

  /**
   * Get current status
   */
  getStatus() {
    return this.hasJob;
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.JobIndicator = JobIndicator;
}

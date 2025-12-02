/**
 * Resume Preview Component
 * Smart resume preview with syntax highlighting and editing
 */

class ResumePreview {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.resumeData = null;
    this.isEditable = false;
  }

  /**
   * Initialize preview
   */
  initialize() {
    if (!this.container) {
      console.warn('[ResumePreview] Container not found');
      return;
    }

    this.setupUI();
    this.attachListeners();
    console.log('[ResumePreview] Initialized');
  }

  /**
   * Setup preview UI
   */
  setupUI() {
    this.container.innerHTML = `
      <div class="resume-preview-wrapper">
        <div class="resume-preview-toolbar">
          <button class="preview-btn" id="toggle-edit-mode" title="Toggle edit mode">
            <span class="edit-icon">✏️</span>
            <span class="view-icon">👁️</span>
            <span class="btn-text"></span>
          </button>
          <div class="preview-info">
            <span id="preview-status">No resume loaded</span>
          </div>
        </div>
        <div class="resume-preview-content" id="preview-content">
          <div class="preview-empty-state">
            <div class="empty-icon">📄</div>
            <h3>No Resume Yet</h3>
            <p>Upload or paste your resume to see a preview here</p>
          </div>
        </div>
      </div>
    `;

    this.addStyles();
  }

  /**
   * Add preview styles
   */
  addStyles() {
    if (document.getElementById('resume-preview-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'resume-preview-styles';
    styles.textContent = `
      .resume-preview-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--color-bg-primary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
      }

      .resume-preview-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--color-bg-secondary);
        border-bottom: 1px solid var(--color-border);
      }

      .resume-preview-toolbar .preview-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--color-bg-primary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .resume-preview-toolbar .preview-btn:hover {
        background: var(--color-bg-tertiary);
        border-color: var(--color-primary);
      }

      .resume-preview-toolbar .preview-btn .view-icon {
        display: none;
      }

      .resume-preview-wrapper.edit-mode .preview-btn .edit-icon {
        display: none;
      }

      .resume-preview-wrapper.edit-mode .preview-btn .view-icon {
        display: inline;
      }

      .preview-info {
        font-size: 13px;
        color: var(--color-text-muted);
      }

      .preview-info.loaded {
        color: var(--color-success);
        font-weight: 500;
      }

      .resume-preview-content {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
        font-family: var(--font-family-primary);
        line-height: var(--line-height-relaxed);
      }

      .preview-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        color: var(--color-text-muted);
      }

      .preview-empty-state .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .preview-empty-state h3 {
        margin: 0 0 8px;
        font-size: 20px;
        color: var(--color-text-secondary);
      }

      .preview-empty-state p {
        margin: 0;
        font-size: 14px;
      }

      /* Resume content styles */
      .resume-content {
        max-width: 800px;
        margin: 0 auto;
        animation: fadeIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .resume-content h1 {
        font-size: 28px;
        font-weight: 700;
        color: var(--color-primary);
        margin: 0 0 8px;
        border-bottom: 3px solid var(--color-primary);
        padding-bottom: 8px;
      }

      .resume-content h2 {
        font-size: 20px;
        font-weight: 600;
        color: var(--color-secondary);
        margin: 24px 0 12px;
        padding-bottom: 6px;
        border-bottom: 2px solid var(--color-border);
      }

      .resume-content h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 16px 0 8px;
      }

      .resume-content p {
        margin: 8px 0;
        color: var(--color-text-secondary);
      }

      .resume-content ul,
      .resume-content ol {
        margin: 8px 0;
        padding-left: 24px;
      }

      .resume-content li {
        margin: 4px 0;
        color: var(--color-text-secondary);
      }

      .resume-content a {
        color: var(--color-primary);
        text-decoration: none;
      }

      .resume-content a:hover {
        text-decoration: underline;
      }

      .resume-content strong {
        color: var(--color-text-primary);
        font-weight: 600;
      }

      .resume-content em {
        color: var(--color-text-muted);
        font-style: italic;
      }

      /* Section styling */
      .resume-section {
        margin-bottom: 24px;
      }

      .resume-section-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 8px;
      }

      .resume-section-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-primary);
      }

      .resume-section-date {
        font-size: 14px;
        color: var(--color-text-muted);
        font-style: italic;
      }

      /* Edit mode */
      .resume-preview-wrapper.edit-mode .resume-content {
        padding: 16px;
        background: var(--color-bg-secondary);
        border: 2px solid var(--color-primary-light);
        border-radius: var(--radius-lg);
      }

      .resume-preview-wrapper.edit-mode .resume-content[contenteditable="true"] {
        outline: none;
        cursor: text;
      }

      .resume-preview-wrapper.edit-mode .resume-content[contenteditable="true"]:focus {
        background: var(--color-bg-primary);
        box-shadow: 0 0 0 4px var(--color-primary-bg);
      }

      /* Syntax highlighting for code blocks */
      .resume-content code {
        background: var(--color-bg-secondary);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: var(--font-family-mono);
        font-size: 0.9em;
        color: var(--color-danger);
      }

      .resume-content pre {
        background: var(--color-bg-secondary);
        padding: 16px;
        border-radius: var(--radius-base);
        overflow-x: auto;
        font-family: var(--font-family-mono);
        font-size: 14px;
      }

      .resume-content pre code {
        background: none;
        padding: 0;
      }

      /* Dark theme */
      [data-theme="dark"] .resume-content h1 {
        color: var(--color-primary-light);
      }

      [data-theme="dark"] .resume-content h2 {
        color: var(--color-secondary-light);
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Attach event listeners
   */
  attachListeners() {
    // Edit mode toggle
    const editBtn = document.getElementById('toggle-edit-mode');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.toggleEditMode());
    }

    // Resume input listeners
    const resumeText = document.getElementById('resume-text');
    if (resumeText) {
      resumeText.addEventListener('input', () => {
        this.updatePreview(resumeText.value);
      });

      // Load initial content
      if (resumeText.value) {
        this.updatePreview(resumeText.value);
      }
    }

    const resumeFile = document.getElementById('resume-file');
    if (resumeFile) {
      resumeFile.addEventListener('change', (e) => {
        this.handleFileUpload(e.target.files[0]);
      });
    }
  }

  /**
   * Handle file upload
   */
  async handleFileUpload(file) {
    if (!file) return;

    const content = document.getElementById('preview-content');
    const status = document.getElementById('preview-status');

    status.textContent = 'Loading...';

    try {
      const text = await this.readFile(file);
      this.updatePreview(text);
      status.textContent = `Loaded: ${file.name}`;
      status.classList.add('loaded');
    } catch (error) {
      console.error('[ResumePreview] Failed to load file:', error);
      status.textContent = 'Error loading file';
    }
  }

  /**
   * Read file as text
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Update preview content
   */
  updatePreview(text) {
    if (!text || text.length < 10) {
      this.showEmptyState();
      return;
    }

    const content = document.getElementById('preview-content');
    const status = document.getElementById('preview-status');

    // Parse and format the resume
    const formatted = this.formatResume(text);

    content.innerHTML = `<div class="resume-content">${formatted}</div>`;

    status.textContent = 'Resume loaded';
    status.classList.add('loaded');

    this.resumeData = text;

    // Dispatch update event
    window.dispatchEvent(new CustomEvent('resumePreviewUpdated', {
      detail: { content: text }
    }));
  }

  /**
   * Format resume text with smart parsing
   */
  formatResume(text) {
    // Simple markdown-like parsing
    let html = text;

    // Escape HTML
    html = html.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');

    // Headers (lines in ALL CAPS or starting with #)
    html = html.replace(/^([A-Z\s]{3,})$/gm, '<h2>$1</h2>');
    html = html.replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>');

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Email addresses
    html = html.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '<a href="mailto:$1">$1</a>');

    // Phone numbers
    html = html.replace(/(\d{3}[-.]?\d{3}[-.]?\d{4})/g, '<strong>$1</strong>');

    // Bullet lists (-, *, •)
    html = html.replace(/^[\-\*•]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Line breaks to paragraphs
    html = html.split('\n\n').map(para => {
      if (!para.match(/^<[h|u]/)) {
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
      }
      return para;
    }).join('\n');

    return html;
  }

  /**
   * Show empty state
   */
  showEmptyState() {
    const content = document.getElementById('preview-content');
    const status = document.getElementById('preview-status');

    content.innerHTML = `
      <div class="preview-empty-state">
        <div class="empty-icon">📄</div>
        <h3>No Resume Yet</h3>
        <p>Upload or paste your resume to see a preview here</p>
      </div>
    `;

    status.textContent = 'No resume loaded';
    status.classList.remove('loaded');

    this.resumeData = null;
  }

  /**
   * Toggle edit mode
   */
  toggleEditMode() {
    const wrapper = this.container.querySelector('.resume-preview-wrapper');
    const content = this.container.querySelector('.resume-content');
    const btn = document.getElementById('toggle-edit-mode');

    if (!content) return;

    this.isEditable = !this.isEditable;

    if (this.isEditable) {
      wrapper.classList.add('edit-mode');
      content.setAttribute('contenteditable', 'true');
      content.focus();
      btn.querySelector('.btn-text').textContent = 'View Mode';
    } else {
      wrapper.classList.remove('edit-mode');
      content.removeAttribute('contenteditable');
      btn.querySelector('.btn-text').textContent = 'Edit Mode';

      // Save changes
      const resumeText = document.getElementById('resume-text');
      if (resumeText) {
        resumeText.value = content.innerText;
      }
    }
  }

  /**
   * Get preview content
   */
  getContent() {
    return this.resumeData;
  }

  /**
   * Clear preview
   */
  clear() {
    this.showEmptyState();
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.ResumePreview = ResumePreview;
}

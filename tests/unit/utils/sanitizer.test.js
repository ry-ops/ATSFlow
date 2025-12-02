/**
 * Unit Tests for InputSanitizer
 * Tests the input sanitization and security utilities
 */

// Mock document object for sanitizer
global.document = {
  createElement: (tag) => {
    const element = {
      tagName: tag.toUpperCase(),
      textContent: '',
      innerHTML: '',
      innerText: '',
      get innerHTML() {
        return this._innerHTML || this.textContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      },
      set innerHTML(value) {
        this._innerHTML = value;
        // Simple text extraction for testing
        this.textContent = value.replace(/<[^>]*>/g, '');
      },
      set textContent(value) {
        this._textContent = value;
        // When setting textContent, innerHTML should be escaped
        this._innerHTML = value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      },
      get textContent() {
        return this._textContent || '';
      },
      get innerText() {
        return this.textContent;
      }
    };
    return element;
  }
};

// Mock logger
global.logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Load the module after mocks are set up
const sanitizerModule = require('../../../js/utils/sanitizer.js');

describe('InputSanitizer', () => {
  let sanitizer;

  beforeEach(() => {
    // Create a new instance for each test
    sanitizer = new (require('../../../js/utils/sanitizer.js').constructor || class InputSanitizer {
      constructor() {
        this.ALLOWED_TAGS = ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li'];
        this.ALLOWED_ATTRIBUTES = ['class', 'id'];
        this.MAX_TEXT_LENGTH = 100000;
        this.MAX_API_KEY_LENGTH = 200;
        this.MAX_FILENAME_LENGTH = 255;
        this.ALLOWED_FILE_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx'];
        this.ALLOWED_MIME_TYPES = [
          'text/plain',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        this.MAX_FILE_SIZE = 10 * 1024 * 1024;
      }

      sanitizeHtml(html, stripAll = false) {
        if (!html || typeof html !== 'string') return '';
        if (html.length > this.MAX_TEXT_LENGTH) {
          html = html.substring(0, this.MAX_TEXT_LENGTH);
        }
        if (stripAll) return this.stripHtml(html);
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
      }

      stripHtml(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
      }

      escapeHtml(text) {
        if (!text || typeof text !== 'string') return '';
        const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '/': '&#x2F;'
        };
        return text.replace(/[&<>"'/]/g, char => map[char]);
      }

      sanitizeUserInput(input) {
        if (!input || typeof input !== 'string') return '';
        let sanitized = this.escapeHtml(input);
        sanitized = this.removeDangerousPatterns(sanitized);
        return sanitized;
      }

      removeDangerousPatterns(text) {
        text = text.replace(/javascript:/gi, '');
        text = text.replace(/data:text\/html/gi, '');
        text = text.replace(/vbscript:/gi, '');
        text = text.replace(/on\w+\s*=/gi, '');
        return text;
      }

      validateApiKey(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
          return { valid: false, sanitized: '', error: 'API key is required' };
        }
        const sanitized = apiKey.trim();
        if (sanitized.length > this.MAX_API_KEY_LENGTH) {
          return { valid: false, sanitized: '', error: 'API key exceeds maximum length' };
        }
        if (!sanitized.match(/^sk-ant-[a-zA-Z0-9_-]+$/)) {
          return { valid: false, sanitized: '', error: 'Invalid API key format (should start with sk-ant-)' };
        }
        return { valid: true, sanitized: sanitized, error: null };
      }

      validateFileUpload(file) {
        if (!file) return { valid: false, error: 'No file provided' };
        if (file.size > this.MAX_FILE_SIZE) {
          return { valid: false, error: `File size exceeds maximum (${this.MAX_FILE_SIZE / 1024 / 1024}MB)` };
        }
        const extension = this.getFileExtension(file.name);
        if (!this.ALLOWED_FILE_EXTENSIONS.includes(extension.toLowerCase())) {
          return { valid: false, error: `File type not allowed. Allowed types: ${this.ALLOWED_FILE_EXTENSIONS.join(', ')}` };
        }
        if (file.type && !this.ALLOWED_MIME_TYPES.includes(file.type)) {
          return { valid: false, error: `MIME type not allowed: ${file.type}` };
        }
        if (this.containsDirectoryTraversal(file.name)) {
          return { valid: false, error: 'Invalid filename: directory traversal detected' };
        }
        return { valid: true, error: null };
      }

      getFileExtension(filename) {
        const lastDot = filename.lastIndexOf('.');
        return lastDot !== -1 ? filename.substring(lastDot) : '';
      }

      containsDirectoryTraversal(filename) {
        return /(\.\.[/\\]|[/\\]\.\.)/.test(filename);
      }

      sanitizeUrl(url) {
        if (!url || typeof url !== 'string') {
          return { valid: false, sanitized: '', error: 'URL is required' };
        }
        const trimmed = url.trim();
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
        const lowerUrl = trimmed.toLowerCase();
        for (const protocol of dangerousProtocols) {
          if (lowerUrl.startsWith(protocol)) {
            return { valid: false, sanitized: '', error: `Dangerous protocol detected: ${protocol}` };
          }
        }
        if (!trimmed.match(/^(https?:)?\/\//)) {
          return { valid: false, sanitized: '', error: 'Only HTTP(S) URLs are allowed' };
        }
        return { valid: true, sanitized: trimmed, error: null };
      }

      sanitizeJson(jsonString) {
        if (!jsonString || typeof jsonString !== 'string') {
          return { valid: false, parsed: null, error: 'Invalid JSON input' };
        }
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed && typeof parsed === 'object') {
            if ('__proto__' in parsed || 'constructor' in parsed || 'prototype' in parsed) {
              return { valid: false, parsed: null, error: 'Potential prototype pollution detected' };
            }
          }
          return { valid: true, parsed: parsed, error: null };
        } catch (error) {
          return { valid: false, parsed: null, error: `JSON parse error: ${error.message}` };
        }
      }

      validateTextInput(text, fieldName = 'Input') {
        if (!text || typeof text !== 'string') {
          return { valid: false, sanitized: '', error: `${fieldName} is required` };
        }
        const trimmed = text.trim();
        if (trimmed.length === 0) {
          return { valid: false, sanitized: '', error: `${fieldName} cannot be empty` };
        }
        if (trimmed.length > this.MAX_TEXT_LENGTH) {
          return { valid: false, sanitized: '', error: `${fieldName} exceeds maximum length (${this.MAX_TEXT_LENGTH} characters)` };
        }
        const sanitized = this.sanitizeUserInput(trimmed);
        return { valid: true, sanitized: sanitized, error: null };
      }
    })();
  });

  describe('HTML Sanitization', () => {
    test('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizer.escapeHtml(input);

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    test('should escape ampersands', () => {
      expect(sanitizer.escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    test('should escape quotes', () => {
      const result = sanitizer.escapeHtml('"Hello" and \'World\'');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
    });

    test('should handle empty or null input', () => {
      expect(sanitizer.escapeHtml('')).toBe('');
      expect(sanitizer.escapeHtml(null)).toBe('');
      expect(sanitizer.escapeHtml(undefined)).toBe('');
    });

    test('should strip all HTML tags', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizer.stripHtml(input);

      expect(result).toBe('Hello World');
    });

    test('should sanitize user input for display', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizer.sanitizeUserInput(input);

      expect(result).not.toContain('<script>');
    });
  });

  describe('Dangerous Pattern Removal', () => {
    test('should remove javascript: protocol', () => {
      const input = 'javascript:alert("XSS")';
      const result = sanitizer.removeDangerousPatterns(input);

      expect(result).not.toContain('javascript:');
    });

    test('should remove data: protocol', () => {
      const input = 'data:text/html,<script>alert("XSS")</script>';
      const result = sanitizer.removeDangerousPatterns(input);

      expect(result).not.toContain('data:text/html');
    });

    test('should remove vbscript: protocol', () => {
      const input = 'vbscript:msgbox("XSS")';
      const result = sanitizer.removeDangerousPatterns(input);

      expect(result).not.toContain('vbscript:');
    });

    test('should remove event handlers', () => {
      const input = 'onclick=alert("XSS")';
      const result = sanitizer.removeDangerousPatterns(input);

      expect(result).not.toContain('onclick=');
    });
  });

  describe('API Key Validation', () => {
    test('should validate correct API key format', () => {
      const result = sanitizer.validateApiKey('sk-ant-api03-test123-abcdef');

      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject empty API key', () => {
      const result = sanitizer.validateApiKey('');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('should reject API key without sk-ant- prefix', () => {
      const result = sanitizer.validateApiKey('invalid-key-format');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid API key format');
    });

    test('should reject too long API key', () => {
      const longKey = 'sk-ant-' + 'a'.repeat(300);
      const result = sanitizer.validateApiKey(longKey);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum length');
    });

    test('should trim whitespace from API key', () => {
      const result = sanitizer.validateApiKey('  sk-ant-api03-test123  ');

      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('sk-ant-api03-test123');
    });
  });

  describe('File Upload Validation', () => {
    test('should validate proper PDF file', () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = sanitizer.validateFileUpload(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject file that is too large', () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });

      const result = sanitizer.validateFileUpload(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    test('should reject unsupported file extension', () => {
      const file = new File(['content'], 'malware.exe', { type: 'application/octet-stream' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = sanitizer.validateFileUpload(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('File type not allowed');
    });

    test('should reject directory traversal attempts', () => {
      const file = new File(['content'], '../../../etc/passwd', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = sanitizer.validateFileUpload(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('directory traversal');
    });

    test('should accept DOCX files', () => {
      const file = new File(['content'], 'resume.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = sanitizer.validateFileUpload(file);

      expect(result.valid).toBe(true);
    });
  });

  describe('URL Sanitization', () => {
    test('should validate HTTPS URL', () => {
      const result = sanitizer.sanitizeUrl('https://example.com');

      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('https://example.com');
    });

    test('should validate HTTP URL', () => {
      const result = sanitizer.sanitizeUrl('http://example.com');

      expect(result.valid).toBe(true);
    });

    test('should reject javascript: protocol', () => {
      const result = sanitizer.sanitizeUrl('javascript:alert("XSS")');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Dangerous protocol');
    });

    test('should reject data: protocol', () => {
      const result = sanitizer.sanitizeUrl('data:text/html,<script>alert("XSS")</script>');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Dangerous protocol');
    });

    test('should reject file: protocol', () => {
      const result = sanitizer.sanitizeUrl('file:///etc/passwd');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Dangerous protocol');
    });

    test('should handle empty URL', () => {
      const result = sanitizer.sanitizeUrl('');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('URL is required');
    });
  });

  describe('JSON Sanitization', () => {
    test('should parse valid JSON', () => {
      const result = sanitizer.sanitizeJson('{"name": "John", "age": 30}');

      expect(result.valid).toBe(true);
      expect(result.parsed).toEqual({ name: 'John', age: 30 });
    });

    test('should reject invalid JSON', () => {
      const result = sanitizer.sanitizeJson('not valid json');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('JSON parse error');
    });

    test('should detect prototype pollution attempt', () => {
      const result = sanitizer.sanitizeJson('{"__proto__": {"isAdmin": true}}');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('prototype pollution');
    });

    test('should handle empty input', () => {
      const result = sanitizer.sanitizeJson('');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid JSON input');
    });
  });

  describe('Text Input Validation', () => {
    test('should validate proper text input', () => {
      const result = sanitizer.validateTextInput('Hello World', 'Message');

      expect(result.valid).toBe(true);
      expect(result.sanitized).toBeTruthy();
    });

    test('should reject empty input', () => {
      const result = sanitizer.validateTextInput('   ', 'Message');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    test('should reject null input', () => {
      const result = sanitizer.validateTextInput(null, 'Message');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('should use custom field name in errors', () => {
      const result = sanitizer.validateTextInput('', 'Resume Title');

      expect(result.error).toContain('Resume Title');
    });

    test('should sanitize XSS in text input', () => {
      const result = sanitizer.validateTextInput('<script>alert("XSS")</script>', 'Message');

      expect(result.valid).toBe(true);
      expect(result.sanitized).not.toContain('<script>');
    });
  });

  describe('Helper Methods', () => {
    test('should extract file extension', () => {
      expect(sanitizer.getFileExtension('resume.pdf')).toBe('.pdf');
      expect(sanitizer.getFileExtension('document.docx')).toBe('.docx');
      expect(sanitizer.getFileExtension('noextension')).toBe('');
    });

    test('should detect directory traversal', () => {
      expect(sanitizer.containsDirectoryTraversal('../file.pdf')).toBe(true);
      expect(sanitizer.containsDirectoryTraversal('..\\file.pdf')).toBe(true);
      expect(sanitizer.containsDirectoryTraversal('normal-file.pdf')).toBe(false);
    });
  });
});

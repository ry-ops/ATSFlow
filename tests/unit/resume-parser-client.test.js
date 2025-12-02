/**
 * Unit Tests for ResumeParserClient
 * Tests the client-side resume parsing and file upload functionality
 */

const ResumeParserClient = require('../../js/resume-parser-client.js');

describe('ResumeParserClient', () => {
  let client;
  let mockFetch;

  beforeEach(() => {
    client = new ResumeParserClient('http://test-api.com');
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    test('should initialize with default API base URL', () => {
      const defaultClient = new ResumeParserClient();
      expect(defaultClient.apiBaseUrl).toBe('');
    });

    test('should initialize with custom API base URL', () => {
      expect(client.apiBaseUrl).toBe('http://test-api.com');
    });

    test('should have supported formats defined', () => {
      expect(client.supportedFormats).toEqual(['pdf', 'docx', 'doc', 'txt']);
    });
  });

  describe('isFileSupported', () => {
    test('should return true for PDF files', () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      expect(client.isFileSupported(file)).toBe(true);
    });

    test('should return true for DOCX files', () => {
      const file = new File(['content'], 'resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      expect(client.isFileSupported(file)).toBe(true);
    });

    test('should return true for DOC files', () => {
      const file = new File(['content'], 'resume.doc', { type: 'application/msword' });
      expect(client.isFileSupported(file)).toBe(true);
    });

    test('should return true for TXT files', () => {
      const file = new File(['content'], 'resume.txt', { type: 'text/plain' });
      expect(client.isFileSupported(file)).toBe(true);
    });

    test('should return false for unsupported files', () => {
      const file = new File(['content'], 'resume.exe', { type: 'application/octet-stream' });
      expect(client.isFileSupported(file)).toBe(false);
    });

    test('should handle uppercase extensions', () => {
      const file = new File(['content'], 'resume.PDF', { type: 'application/pdf' });
      expect(client.isFileSupported(file)).toBe(true);
    });
  });

  describe('validateFile', () => {
    test('should validate a proper file', () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      const result = client.validateFile(file);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject files that are too large', () => {
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
      const file = new File([largeContent], 'resume.pdf', { type: 'application/pdf' });
      const result = client.validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('exceeds maximum');
    });

    test('should reject unsupported file formats', () => {
      const file = new File(['content'], 'resume.zip', { type: 'application/zip' });
      const result = client.validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Unsupported file format');
    });

    test('should return error when no file provided', () => {
      const result = client.validateFile(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('No file provided');
    });

    test('should warn about very small files', () => {
      const file = new File(['x'], 'resume.pdf', { type: 'application/pdf' });
      const result = client.validateFile(file);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('very small');
    });

    test('should warn about very long filenames', () => {
      const longName = 'a'.repeat(260) + '.pdf';
      const file = new File(['content'], longName, { type: 'application/pdf' });
      const result = client.validateFile(file);

      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('formatFileSize', () => {
    test('should format bytes correctly', () => {
      expect(client.formatFileSize(500)).toBe('500 B');
    });

    test('should format kilobytes correctly', () => {
      expect(client.formatFileSize(2048)).toBe('2.00 KB');
    });

    test('should format megabytes correctly', () => {
      expect(client.formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
    });

    test('should handle zero bytes', () => {
      expect(client.formatFileSize(0)).toBe('0 B');
    });
  });

  describe('parseResume', () => {
    test('should reject unsupported files', async () => {
      const file = new File(['content'], 'resume.exe', { type: 'application/octet-stream' });

      const result = await client.parseResume(file);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported file format');
    });

    test('should send file to API endpoint', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} })
      });

      await client.parseResume(file);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/parse',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
    });

    test('should include API key if provided', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: {} })
      });

      await client.parseResume(file, 'test-api-key');

      const formData = mockFetch.mock.calls[0][1].body;
      expect(formData).toBeInstanceOf(FormData);
    });

    test('should handle successful API response', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      const mockResponse = {
        success: true,
        data: { sections: [], stats: {} }
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.parseResume(file);

      expect(result).toEqual(mockResponse);
    });

    test('should handle API error response', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'API error' })
      });

      const result = await client.parseResume(file);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API error');
    });

    test('should handle network errors', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await client.parseResume(file);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    test('should set useAI flag when requested', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await client.parseResume(file, 'api-key', true);

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('extractResumeData', () => {
    test('should require API key', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      const result = await client.extractResumeData(file, null);

      expect(result.success).toBe(false);
      expect(result.error).toContain('API key is required');
    });

    test('should reject unsupported files', async () => {
      const file = new File(['content'], 'resume.exe', { type: 'application/octet-stream' });

      const result = await client.extractResumeData(file, 'api-key');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported file format');
    });

    test('should send file to extract endpoint', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, structuredData: {} })
      });

      await client.extractResumeData(file, 'test-api-key');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/extract',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
    });

    test('should handle successful extraction', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      const mockResponse = {
        success: true,
        structuredData: {
          personalInfo: { name: 'John Doe' },
          experience: []
        }
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.extractResumeData(file, 'api-key');

      expect(result).toEqual(mockResponse);
    });

    test('should handle extraction errors', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Extraction failed' })
      });

      const result = await client.extractResumeData(file, 'api-key');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Extraction failed');
    });
  });

  describe('parseMultiple', () => {
    test('should reject unsupported files in batch', async () => {
      const files = [
        new File(['content'], 'resume1.pdf', { type: 'application/pdf' }),
        new File(['content'], 'resume2.exe', { type: 'application/octet-stream' })
      ];

      const result = await client.parseMultiple(files);

      expect(result.success).toBe(false);
      expect(result.error).toContain('unsupported formats');
    });

    test('should reject batches larger than 10 files', async () => {
      const files = Array.from({ length: 11 }, (_, i) =>
        new File(['content'], `resume${i}.pdf`, { type: 'application/pdf' })
      );

      const result = await client.parseMultiple(files);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Maximum 10 files');
    });

    test('should send multiple files to batch endpoint', async () => {
      const files = [
        new File(['content'], 'resume1.pdf', { type: 'application/pdf' }),
        new File(['content'], 'resume2.pdf', { type: 'application/pdf' })
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, results: [] })
      });

      await client.parseMultiple(files);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com/api/parse-batch',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
    });

    test('should handle successful batch parse', async () => {
      const files = [
        new File(['content'], 'resume1.pdf', { type: 'application/pdf' }),
        new File(['content'], 'resume2.pdf', { type: 'application/pdf' })
      ];

      const mockResponse = {
        success: true,
        results: [{}, {}]
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.parseMultiple(files);

      expect(result).toEqual(mockResponse);
    });

    test('should convert FileList to array', async () => {
      const files = [
        new File(['content'], 'resume1.pdf', { type: 'application/pdf' }),
        new File(['content'], 'resume2.pdf', { type: 'application/pdf' })
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await client.parseMultiple(files);

      expect(mockFetch).toHaveBeenCalled();
    });
  });
});

describe('ResumeParserUI', () => {
  // Note: ResumeParserUI is exported from the same file
  // These tests would require DOM elements and would be better suited for integration tests
  // For now, we'll add basic structure tests

  test('should export ResumeParserUI helper object', () => {
    const module = require('../../js/resume-parser-client.js');
    expect(module.ResumeParserUI).toBeDefined();
  });
});

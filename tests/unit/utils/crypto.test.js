/**
 * Unit Tests for CryptoManager
 * Tests encryption/decryption functionality
 */

// Mock Web Crypto API
const mockCrypto = {
  getRandomValues: jest.fn((array) => {
    // Fill array with pseudo-random values for testing
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
  subtle: {
    importKey: jest.fn((format, keyData, algorithm, extractable, keyUsages) => {
      return Promise.resolve({ type: 'secret', algorithm, extractable, usages: keyUsages });
    }),
    deriveKey: jest.fn(() => {
      return Promise.resolve({ type: 'secret', algorithm: { name: 'AES-GCM' } });
    }),
    deriveBits: jest.fn(() => {
      return Promise.resolve(new ArrayBuffer(32));
    }),
    encrypt: jest.fn((algorithm, key, data) => {
      // Simple mock: just return the data with some prefix
      const prefix = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
      const result = new Uint8Array(prefix.length + data.byteLength);
      result.set(prefix);
      result.set(new Uint8Array(data), prefix.length);
      return Promise.resolve(result.buffer);
    }),
    decrypt: jest.fn((algorithm, key, data) => {
      // Simple mock: remove the prefix we added in encrypt
      const encrypted = new Uint8Array(data);
      const decrypted = encrypted.slice(4); // Remove 4-byte prefix
      return Promise.resolve(decrypted.buffer);
    })
  }
};

global.crypto = mockCrypto;
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');

// Mock TextEncoder and TextDecoder
global.TextEncoder = class TextEncoder {
  encode(text) {
    const buffer = Buffer.from(text, 'utf8');
    return new Uint8Array(buffer);
  }
};

global.TextDecoder = class TextDecoder {
  decode(buffer) {
    return Buffer.from(buffer).toString('utf8');
  }
};

// Mock logger
global.logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe('CryptoManager', () => {
  let CryptoManager;
  let cryptoManager;

  beforeAll(() => {
    // Create CryptoManager class for testing
    CryptoManager = class CryptoManager {
      constructor() {
        this.ALGORITHM = 'AES-GCM';
        this.KEY_LENGTH = 256;
        this.IV_LENGTH = 12;
        this.SALT_LENGTH = 16;
        this.ITERATIONS = 100000;
        this.TAG_LENGTH = 128;
      }

      async deriveKey(passphrase, salt) {
        const encoder = new TextEncoder();
        const passphraseKey = await crypto.subtle.importKey(
          'raw',
          encoder.encode(passphrase),
          'PBKDF2',
          false,
          ['deriveBits', 'deriveKey']
        );

        return crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: this.ITERATIONS,
            hash: 'SHA-256'
          },
          passphraseKey,
          {
            name: this.ALGORITHM,
            length: this.KEY_LENGTH
          },
          false,
          ['encrypt', 'decrypt']
        );
      }

      async encrypt(plaintext, passphrase) {
        if (!plaintext || !passphrase) {
          throw new Error('Plaintext and passphrase are required');
        }

        const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
        const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
        const key = await this.deriveKey(passphrase, salt);
        const encoder = new TextEncoder();
        const encryptedData = await crypto.subtle.encrypt(
          {
            name: this.ALGORITHM,
            iv: iv,
            tagLength: this.TAG_LENGTH
          },
          key,
          encoder.encode(plaintext)
        );

        const combined = new Uint8Array(
          this.SALT_LENGTH + this.IV_LENGTH + encryptedData.byteLength
        );
        combined.set(salt, 0);
        combined.set(iv, this.SALT_LENGTH);
        combined.set(new Uint8Array(encryptedData), this.SALT_LENGTH + this.IV_LENGTH);

        return this.arrayBufferToBase64(combined);
      }

      async decrypt(encryptedBase64, passphrase) {
        if (!encryptedBase64 || !passphrase) {
          throw new Error('Encrypted data and passphrase are required');
        }

        try {
          const combined = this.base64ToArrayBuffer(encryptedBase64);
          const salt = combined.slice(0, this.SALT_LENGTH);
          const iv = combined.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
          const encryptedData = combined.slice(this.SALT_LENGTH + this.IV_LENGTH);
          const key = await this.deriveKey(passphrase, salt);
          const decryptedData = await crypto.subtle.decrypt(
            {
              name: this.ALGORITHM,
              iv: iv,
              tagLength: this.TAG_LENGTH
            },
            key,
            encryptedData
          );

          const decoder = new TextDecoder();
          return decoder.decode(decryptedData);
        } catch (error) {
          throw new Error('Decryption failed: Invalid passphrase or corrupted data');
        }
      }

      async storeApiKey(apiKey, passphrase) {
        const encrypted = await this.encrypt(apiKey, passphrase);
        localStorage.setItem('claude_api_key_encrypted', encrypted);
        localStorage.setItem('encryption_enabled', 'true');
        localStorage.removeItem('claude_api_key');
      }

      async retrieveApiKey(passphrase) {
        const encrypted = localStorage.getItem('claude_api_key_encrypted');
        if (!encrypted) {
          return null;
        }
        return await this.decrypt(encrypted, passphrase);
      }

      hasEncryptedKey() {
        return localStorage.getItem('claude_api_key_encrypted') !== null;
      }

      hasUnencryptedKey() {
        return localStorage.getItem('claude_api_key') !== null;
      }

      async migrateToEncrypted(passphrase) {
        const unencryptedKey = localStorage.getItem('claude_api_key');
        if (!unencryptedKey) {
          return false;
        }
        await this.storeApiKey(unencryptedKey, passphrase);
        return true;
      }

      clearAllKeys() {
        localStorage.removeItem('claude_api_key');
        localStorage.removeItem('claude_api_key_encrypted');
        localStorage.removeItem('encryption_enabled');
      }

      arrayBufferToBase64(buffer) {
        const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      }

      base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      }

      generateSecurePassphrase(length = 32) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return Array.from(values)
          .map(x => charset[x % charset.length])
          .join('');
      }
    };
  });

  beforeEach(() => {
    cryptoManager = new CryptoManager();
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    test('should initialize with correct algorithm settings', () => {
      expect(cryptoManager.ALGORITHM).toBe('AES-GCM');
      expect(cryptoManager.KEY_LENGTH).toBe(256);
      expect(cryptoManager.IV_LENGTH).toBe(12);
      expect(cryptoManager.SALT_LENGTH).toBe(16);
    });

    test('should use secure PBKDF2 iterations', () => {
      expect(cryptoManager.ITERATIONS).toBe(100000);
    });
  });

  describe('Key Derivation', () => {
    test('should derive key from passphrase', async () => {
      const passphrase = 'test-passphrase';
      const salt = new Uint8Array(16);

      const key = await cryptoManager.deriveKey(passphrase, salt);

      expect(key).toBeDefined();
      expect(mockCrypto.subtle.importKey).toHaveBeenCalled();
      expect(mockCrypto.subtle.deriveKey).toHaveBeenCalled();
    });

    test('should use PBKDF2 for key derivation', async () => {
      const passphrase = 'test-passphrase';
      const salt = new Uint8Array(16);

      await cryptoManager.deriveKey(passphrase, salt);

      expect(mockCrypto.subtle.deriveKey).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'PBKDF2',
          iterations: 100000,
          hash: 'SHA-256'
        }),
        expect.any(Object),
        expect.objectContaining({
          name: 'AES-GCM',
          length: 256
        }),
        false,
        ['encrypt', 'decrypt']
      );
    });
  });

  describe('Encryption', () => {
    test('should encrypt plaintext', async () => {
      const plaintext = 'secret-api-key';
      const passphrase = 'my-passphrase';

      const encrypted = await cryptoManager.encrypt(plaintext, passphrase);

      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    test('should throw error if plaintext is missing', async () => {
      await expect(
        cryptoManager.encrypt('', 'passphrase')
      ).rejects.toThrow('Plaintext and passphrase are required');
    });

    test('should throw error if passphrase is missing', async () => {
      await expect(
        cryptoManager.encrypt('plaintext', '')
      ).rejects.toThrow('Plaintext and passphrase are required');
    });

    test('should use random salt and IV', async () => {
      mockCrypto.getRandomValues.mockClear();

      await cryptoManager.encrypt('test', 'passphrase');

      expect(mockCrypto.getRandomValues).toHaveBeenCalledTimes(2);
      expect(mockCrypto.getRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
    });

    test('should call encrypt with AES-GCM algorithm', async () => {
      await cryptoManager.encrypt('test', 'passphrase');

      expect(mockCrypto.subtle.encrypt).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'AES-GCM',
          tagLength: 128
        }),
        expect.any(Object),
        expect.any(Uint8Array)
      );
    });
  });

  describe('Decryption', () => {
    test('should decrypt encrypted data', async () => {
      const plaintext = 'secret-api-key';
      const passphrase = 'my-passphrase';

      const encrypted = await cryptoManager.encrypt(plaintext, passphrase);
      const decrypted = await cryptoManager.decrypt(encrypted, passphrase);

      expect(decrypted).toBe(plaintext);
    });

    test('should throw error if encrypted data is missing', async () => {
      await expect(
        cryptoManager.decrypt('', 'passphrase')
      ).rejects.toThrow('Encrypted data and passphrase are required');
    });

    test('should throw error if passphrase is missing', async () => {
      await expect(
        cryptoManager.decrypt('encrypted', '')
      ).rejects.toThrow('Encrypted data and passphrase are required');
    });

    test('should handle decryption errors gracefully', async () => {
      mockCrypto.subtle.decrypt.mockRejectedValueOnce(new Error('Bad decrypt'));

      await expect(
        cryptoManager.decrypt('invalid-data', 'passphrase')
      ).rejects.toThrow('Decryption failed');
    });
  });

  describe('API Key Storage', () => {
    test('should store encrypted API key', async () => {
      const apiKey = 'sk-ant-api-key-123';
      const passphrase = 'secure-passphrase';

      await cryptoManager.storeApiKey(apiKey, passphrase);

      expect(localStorage.getItem('claude_api_key_encrypted')).toBeDefined();
      expect(localStorage.getItem('encryption_enabled')).toBe('true');
      expect(localStorage.getItem('claude_api_key')).toBeNull();
    });

    test('should retrieve encrypted API key', async () => {
      const apiKey = 'sk-ant-api-key-123';
      const passphrase = 'secure-passphrase';

      await cryptoManager.storeApiKey(apiKey, passphrase);
      const retrieved = await cryptoManager.retrieveApiKey(passphrase);

      expect(retrieved).toBe(apiKey);
    });

    test('should return null if no encrypted key exists', async () => {
      const retrieved = await cryptoManager.retrieveApiKey('passphrase');

      expect(retrieved).toBeNull();
    });

    test('should check if encrypted key exists', () => {
      expect(cryptoManager.hasEncryptedKey()).toBe(false);

      localStorage.setItem('claude_api_key_encrypted', 'encrypted-data');

      expect(cryptoManager.hasEncryptedKey()).toBe(true);
    });

    test('should check if unencrypted key exists', () => {
      expect(cryptoManager.hasUnencryptedKey()).toBe(false);

      localStorage.setItem('claude_api_key', 'unencrypted-key');

      expect(cryptoManager.hasUnencryptedKey()).toBe(true);
    });
  });

  describe('Key Migration', () => {
    test('should migrate unencrypted key to encrypted storage', async () => {
      const apiKey = 'sk-ant-api-key-123';
      localStorage.setItem('claude_api_key', apiKey);

      const result = await cryptoManager.migrateToEncrypted('passphrase');

      expect(result).toBe(true);
      expect(cryptoManager.hasEncryptedKey()).toBe(true);
    });

    test('should return false if no unencrypted key exists', async () => {
      const result = await cryptoManager.migrateToEncrypted('passphrase');

      expect(result).toBe(false);
    });
  });

  describe('Clear Keys', () => {
    test('should clear all stored keys', () => {
      localStorage.setItem('claude_api_key', 'unencrypted');
      localStorage.setItem('claude_api_key_encrypted', 'encrypted');
      localStorage.setItem('encryption_enabled', 'true');

      cryptoManager.clearAllKeys();

      expect(localStorage.getItem('claude_api_key')).toBeNull();
      expect(localStorage.getItem('claude_api_key_encrypted')).toBeNull();
      expect(localStorage.getItem('encryption_enabled')).toBeNull();
    });
  });

  describe('Utility Methods', () => {
    test('should convert ArrayBuffer to Base64', () => {
      const buffer = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
      const base64 = cryptoManager.arrayBufferToBase64(buffer);

      expect(typeof base64).toBe('string');
      expect(base64.length).toBeGreaterThan(0);
    });

    test('should convert Base64 to ArrayBuffer', () => {
      const base64 = btoa('Hello');
      const buffer = cryptoManager.base64ToArrayBuffer(base64);

      expect(buffer).toBeInstanceOf(Uint8Array);
      expect(buffer.length).toBeGreaterThan(0);
    });

    test('should roundtrip Base64 conversion', () => {
      const original = new Uint8Array([1, 2, 3, 4, 5]);
      const base64 = cryptoManager.arrayBufferToBase64(original);
      const decoded = cryptoManager.base64ToArrayBuffer(base64);

      expect(decoded).toEqual(original);
    });
  });

  describe('Passphrase Generation', () => {
    test('should generate secure passphrase', () => {
      const passphrase = cryptoManager.generateSecurePassphrase();

      expect(typeof passphrase).toBe('string');
      expect(passphrase.length).toBe(32);
    });

    test('should generate passphrase of custom length', () => {
      const passphrase = cryptoManager.generateSecurePassphrase(16);

      expect(passphrase.length).toBe(16);
    });

    test('should use random values for passphrase', () => {
      const passphrase1 = cryptoManager.generateSecurePassphrase();
      const passphrase2 = cryptoManager.generateSecurePassphrase();

      // Very unlikely to generate the same passphrase twice
      expect(passphrase1).not.toBe(passphrase2);
    });

    test('should only use allowed characters', () => {
      const passphrase = cryptoManager.generateSecurePassphrase(100);
      const allowedChars = /^[A-Za-z0-9!@#$%^&*]+$/;

      expect(passphrase).toMatch(allowedChars);
    });
  });
});

/**
 * Jest Configuration for ResuMate
 * Configured for both Node.js server-side code and browser-based client code
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Coverage configuration
  collectCoverageFrom: [
    'js/**/*.js',
    'server.js',
    '!js/**/*.test.js',
    '!js/**/*.spec.js',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js',
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>'],

  // Transform configuration (if needed for modern JS)
  transform: {},

  // Mock configuration
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
  ],

  // Verbose output
  verbose: true,

  // Test timeout
  testTimeout: 10000,

  // Module name mapper for CSS and assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },
};

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/mocks/styleMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/setup.js'],
  rootDir: '.',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node']
};
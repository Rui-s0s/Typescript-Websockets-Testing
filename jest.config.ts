import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  testPathIgnorePatterns: [
    "/node_modules/",
    "/playwright/",    // Ignore the folder
    "\\.test\\.ts$"    // Ignore the extension
  ],

  testEnvironment: 'node',

  collectCoverageFrom: [
    'src/**/*.(t|j)s',
  ],

  coverageDirectory: 'coverage',

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
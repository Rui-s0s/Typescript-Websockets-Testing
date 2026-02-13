import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Point to the folder where everything lives
  testDir: './tests', 
  
  // The filter: Only files with ".test" in the name
  testMatch: /.*\.test\.(ts|js)/,

  // Ignore Jest files just in case
  testIgnore: /.*\.spec\.(ts|js)/,

  timeout: 30000,
  workers: 1, 
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
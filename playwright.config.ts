import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',  
  workers: 2,
  use: {
    browserName:'chromium',
    headless: false
  },
});

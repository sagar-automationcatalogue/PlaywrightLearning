import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',  
  workers: 1,
  timeout:60_000,  
  use: {
    browserName:'chromium',
    headless: false,
    /*viewport:{
      width:1920,
      height:1080
    }*/
    viewport:null,
    launchOptions:{
      args: [`--start-maximized`]
    },
    screenshot:'on',
    video:'on',
    trace: 'on'   
  },
  reporter: [
    ['list'],
    ['html',{outputFolder: 'automation-reports', open:'on-failure'}],
    ['junit',{outputFile: `test-results/results.xml`}],
    ['json',{outputFile: `test-results/results.json`}],
  ]
});

import {test} from '@playwright/test';

test('X path with Attributes Learning for DemoWebshop application', async({page})=>{
    await page.goto('https://demowebshop.tricentis.com/login');

    //click on forgot password linke
    await page.locator(`xpath=//a[text()='Forgot password?']`).click();
   
    await page.waitForTimeout(4000);
})
import{test} from '@playwright/test'
test('Demo workshop registration', 
    async ({browser})=>{
    const context=await browser.newContext();
    const page=await context.newPage();
    await page.goto('https://demowebshop.tricentis.com/');
    await page.locator('.ico-register').click();
    await page.locator('#gender-female').click();
    await page.locator('#FirstName').fill(`Vijaya`);
    await page.locator('#LastName').fill(`Durgi`);
    await page.locator('#Email').fill(`vijayadurgi123@gmail.com`);
    await page.locator('#Password').fill(`vijaya@123`);
    await page.locator('#ConfirmPassword').fill(`vijaya@123`);
    await page.locator('#register-button').click();
    await page.waitForTimeout(3000);
})
import {test,expect} from "@playwright/test"

test(`tricentis register click`,async ({browser})=>{

    const context=await browser.newContext();
    const page=await context.newPage();

    await page.goto(`https://demowebshop.tricentis.com/login`);
    await page.locator(`.ico-register`).click();

    await page.waitForTimeout(3000);

    await page.locator(`#gender-female`).click();
    await page.locator(`#FirstName`).fill(`swetha`);
    await page.locator(`#LastName`).fill('basani');
    const mail=`basaniswetha123@gmail.com`
    const pwd=`swetha123`;
    await page.locator(`#Email`).fill(mail);
    
    await page.locator(`#Password`).fill(pwd);
    await page.locator(`#ConfirmPassword`).fill(pwd);
    await page.waitForTimeout(3000);
    await page.locator(`#register-button`).click();
    await page.locator(`.ico-logout`).click();
    await page.locator(`.ico-login`).click();
    await page.locator(`#Email`).fill(mail);
    await page.locator(`#Password`).fill(pwd);
    await page.locator(`.button-1.login-button`).click();
    await page.waitForTimeout(3000);
    const actualmailloc= await page.locator(`a.account`).first();
    await expect(actualmailloc).toHaveText(mail);
    const actualmail=await actualmailloc.textContent();

    await page.waitForTimeout(3000);
    console.log(actualmail);



})
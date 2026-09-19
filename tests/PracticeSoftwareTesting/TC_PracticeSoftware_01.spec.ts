import {expect, test} from '@playwright/test';

test(`TC_PracticeSoftware_01: Invalid Login → Valid Login → Account → Logout`, async({page}) =>{

    await page.goto(`https://practicesoftwaretesting.com/`);

    const titilepage = await page.title()

    console.log(titilepage);
    //await page.getByTestId('nav-sign-in').click();
  await page.getByText('Sign in').click();
  await page.locator('#email').fill('sagar.automationcatalogue8@gmail.com');
  //await page.getByTestId('password').fill('Practiceadmin@123');
  
  //const passwordField = page.locator('#password');
  //await expect(passwordField).toBeVisible();
  await page.locator('#password').fill('Practiceadmin@123');
  //await expect(passwordField).toBeEnabled();
});

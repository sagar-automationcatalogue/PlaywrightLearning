import {test} from '@playwright/test';

test('Chaining locators testcase',async({page})=>
{
    await page.goto(`https://www.automationexercise.com/`);
    await page.getByRole('link',{name:`SignUp / Login`}).click();
    await page.getByPlaceholder(`Name`).fill(`swetha`);
    await page.getByPlaceholder(`Email Address`).nth(1).fill(`swetha.b@gmail.com`);
    await page.getByRole(`button`,{name:`Signup`}).click();

    await page.getByLabel(`Mrs.`).check();
    await page.locator('#password').fill(`swetha123`);
    await page.locator(`#days`).selectOption({value:`6`});
    await page.locator(`#months`).selectOption({value:`9`});
    await page.locator(`#years`).selectOption(`1997`);
    await page.getByLabel(`Sign up for our newsletter!`).click();
    await page.getByLabel(`Receive special offers from our partners!`).click();
    await page.waitForTimeout(2000);
    //await page.locator(`#first_name`).fill(`swetha`);
    await page.getByRole(`textbox`,{name:`First name `}).fill(`swetha`);
    await page.getByRole(`textbox`,{name:`Last name `}).fill(`basani`);
    await page.locator(`#company`).fill(`xyz`);
    await page.locator('#address1').fill('1-234,svs bazar');
    await page.getByRole(`textbox`,{name:`Address 2`}).fill(`guntur`);
    await page.locator(`#country`).selectOption(`India`);
    await page.waitForTimeout(2000);
    await page.getByRole(`textbox`,{name:`State `}).fill(`Andhra Pradesh`);
    await page.locator(`#city`).fill(`guntur`);
    await page.locator(`#zipcode`).fill('522001');
    await page.getByRole(`textbox`,{name:`Mobile Number `}).fill(`4356534233`);
    await page.getByRole(`button`,{name:`Create Account`}).click();
    await page.waitForTimeout(2000);


})


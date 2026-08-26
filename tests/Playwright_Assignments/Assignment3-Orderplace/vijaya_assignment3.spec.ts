import {test} from '@playwright/test'
test("Placing order", async({page})=>
{
    await page.goto('https://demowebshop.tricentis.com/');
    await page.getByRole('link', {name:'Log in'}).click();
    await page.locator('.inputs').locator('#Email').fill('Vijaya.durgi@gmail.com');
    await page.locator('.inputs').locator('#Password').fill('vijaya@123');
    await page.getByLabel('Remember me?').check();
    await page.getByRole('button', {name: 'Log in'}).click();
    await page.locator('.listbox').getByRole('link', {name: 'Computers'}).click();
    await page.locator('.sub-category-item').getByRole('link', { name: 'Notebooks', exact: true }).click();
    await page.getByRole('button', {name: 'Add to cart'}).click();
    await page.locator('.header-links').getByRole('link', {name: 'Shopping cart'}).click();
    await page.locator('input[name="removefromcart"]').check();
    await page.locator('.country-input').selectOption({value: '41'});
    await page.getByRole('textbox', {name: 'Zip / postal code:'}).fill('500048');
    await page.locator('input[name="termsofservice"]').check();
    await page.getByRole('button', {name: 'Checkout'}).click();
    /*await page.getByText('Company:').fill('Darkmatter');
    await page.getByText('Country:').selectOption({value: '41'});
    await page.getByText('City:').fill('Hyderabad');
    await page.getByText('Address 1:').fill('Address1');
    await page.getByText('Address 2:').fill('Address2');
    await page.getByText('Zip / postal code:').fill('500048');
    await page.getByText('Phone number:').fill('9908173733');
    await page.getByText('Fax number:').fill('180009000');
    await page.locator('#billing-buttons-container').locator('input[class="button-1 new-address-next-step-button"]').click(); */
    //await page.locator('#shipping-address-select').selectOption({value: '5116518'});
    //await page.getByText('In-Store Pickup').check();
    await page.locator('#billing-buttons-container').locator('input[value="Continue"]').click()
    await page.getByText('In-Store Pickup').check();
    await page.locator('#shipping-buttons-container').locator('input[value="Continue"]').click()
    await page.getByRole('radio', {name: 'Cash On Delivery (COD) (7.00)'}).check();
    await page.locator('#payment-method-buttons-container').locator('input[value="Continue"]').click();
    await page.locator('#payment-info-buttons-container').locator('input[value="Continue"]').click();
    await page.locator('#confirm-order-buttons-container').locator('input[value="Confirm"]').click();
    console.log("Order has been successfully processed!")
    const orderText = await page.locator('ul.details li').first().textContent();
    console.log(orderText); 
    await page.waitForTimeout(5000);
})
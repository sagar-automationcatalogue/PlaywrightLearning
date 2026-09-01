import test from "@playwright/test";

test('playwright demo webshop test automation', async({page})=>{
    await page.goto("https://demowebshop.tricentis.com/");
    page.setDefaultTimeout(300000);
    await page.getByRole('link', {name:'Log in'}).click();
    await page.locator('.inputs').locator('#Email').fill('sagar.automationcatalogue8@gmail.com');
    await page.locator('.inputs').locator('#Password').fill('Admin@123');
    await page.getByLabel('Remember me?').check();
   // await page.getByRole('checkbox', {name: 'RememberMe'}).check();
    await page.getByRole('button', {name: 'Log in'}).click();
    await page.locator('.listbox').getByRole('link',{name:'Computers'}).click();
    await page.locator('.picture').getByAltText('Picture for category Desktops').click();
    await page.locator('.product-item').getByAltText('Picture of Build your own cheap computer').click();
    await page.locator('.button-1.add-to-cart-button').click();  
    await page.locator('#topcartlink').getByText('Shopping cart').click();
    await page.locator('#termsofservice').check();
   // await page.locator('.checkout-buttons').getByRole('button', {name:'Checkout'}).click();
   await page.locator('#checkout').click();
   //await page.locator('#billing-address-select').click
      //await page.logetByRole('button', {name: 'Add to cart'}).click();
     await page.locator('#billing-buttons-container').getByTitle('Continue').click();
     await page.locator('#shipping-buttons-container').getByTitle('Continue').click();
     await page.getByLabel('Ground (0.00)').check();
     await page.locator('#shipping-method-buttons-container').locator('.button-1.shipping-method-next-step-button').click();
       await page.getByLabel('Cash On Delivery (COD) (7.00)').check();
       await page.locator('#payment-method-buttons-container').locator('.button-1.payment-method-next-step-button').click();
       await page.locator('#payment-info-buttons-container').locator('.button-1.payment-info-next-step-button').click();
       await page.locator('#confirm-order-buttons-container').locator('.button-1.confirm-order-next-step-button').click();
       const orderTitle = await  page.locator('.title').getByText('Your order has been successfully processed!').textContent();
      console.log(orderTitle);

   // await 

   
   
})

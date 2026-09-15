import {test} from "@playwright/test";

test(`new order creation test case`,async({page})=>{
    await page.goto(`https://demowebshop.tricentis.com/`);
    await page.waitForTimeout(2000);
    await page.getByRole(`link`,{name: 'Log in'}).click();
    await page.getByLabel(`Email:`).fill(`basaniswetha123@gmail.com`);
    await page.getByLabel(`Password:`).fill(`swetha123`);
    await page.locator(`.button-1.login-button`).click();

    await page.getByRole(`link`,{name:`Computers`}).nth(1).click();
    await page.locator(`.sub-category-item`).getByRole(`link`,{name:`Notebooks`, exact:true}).click();
    await page.getByRole(`button`,{name:`Add to cart`}).click();
    await page.waitForTimeout(2000);
    await page.locator('.header-links').getByRole('link', {name: 'Shopping cart'}).click();
    
    await page.locator(`input[name="removefromcart"]`).check();
    await page.locator(`#CountryId`).selectOption(`41`);
    await page.locator(`#StateProvinceId`).selectOption(`0`);
    await page.locator('input[name="termsofservice"]').check();
    await page.locator(`#checkout`).click();
    await page.locator(`#billing-buttons-container`).getByRole(`button`,{name:`Continue`}).click();

    /*await page.getByLabel(`Country:`).selectOption(`41`);
    await page.locator(`#BillingNewAddress_City`).fill(`Guntur`);
    await page.locator(`//input[name="BillingNewAddress.Address1"]`).fill(`guntur`);
    await page.getByLabel(`Zip / postal code:`).fill(`522001`);
    await page.getByLabel(`Phone number:`).fill(`2345675433`);*/
    //await page.getByRole(`button`,{name:`Continue`}).click();
    await page.locator(`input[id="PickUpInStore"]`).check();
    
    await page.locator(`#shipping-buttons-container`).getByRole(`button`,{name:`Continue`}).click();
    await page.waitForTimeout(2000);
    await page.locator(`#payment-method-buttons-container`).getByRole(`button`,{name:`Continue`}).click();
    await page.locator(`#paymentmethod_0`).check();
    
    await page.locator(`#payment-info-buttons-container`).getByRole(`button`,{name:`Continue`}).click();
    await page.locator(`#confirm-order-buttons-container`).getByRole(`button`,{name:`Confirm`}).click();
    let confirmtxt=await page.locator(`.title`).getByText(`Your order has been successfully processed!`).textContent();
    console.log(confirmtxt);
})


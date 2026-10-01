import {test, expect} from '@playwright/test';

test('TC_05_ShoppingCart: Configure Apparel Product → Wishlist → Shopping Cart', async ({page}) =>{
    test.setTimeout(180_000);
    // Login and validating the user authentication
    await page.goto('https://demowebshop.tricentis.com/');
    await expect (page.getByRole('link', {name:'Log in'})).toBeVisible({timeout:5_000});
    await page.getByRole('link', {name:'Log in'}).click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/login');
    await page.getByLabel('Email').fill('sagar.automationcatalogue8@gmail.com');
    await page.getByLabel('Password').fill('Admin@123');
    await page.getByRole('button', {name:'Log in'}).click();
    //await page.waitForTimeout(30_000);
    await expect (page.getByRole('link', {name:'Log out'})).toBeVisible({timeout:5_000});
    
    //navigate to apparel & shoes 
    await page.getByRole('link', {name:'Apparel & Shoes'}).click();
    await expect(page.getByRole('heading',{name:'Apparel & Shoes'})).toBeVisible({timeout:5_000});
        
    
});
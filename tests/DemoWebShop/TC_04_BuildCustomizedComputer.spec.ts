import {expect, test} from '@playwright/test'

test('TC_04_BuildCustomizedComputer: Build Customized Computer', async({page})=>{
 
  await page.goto('https://demowebshop.tricentis.com/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill('sagar.automationcatalogue8@gmail.com');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('Admin@123');
  await page.getByRole('checkbox', { name: 'Remember me?' }).check();
  await page.getByRole('button', { name: 'Log in' }).click();

  const computersMenu = page.locator('.top-menu > li').filter({hasText: 'Computers'});
  await computersMenu.hover();
  await expect(computersMenu.getByRole('link', { name: 'Desktops', exact: true })).toBeVisible();
  await expect(computersMenu.getByRole('link', { name: 'Notebooks', exact: true })).toBeVisible();
  await expect(computersMenu.getByRole('link', { name: 'Accessories', exact: true })).toBeVisible();

  await computersMenu.getByRole('link', { name: 'Desktops', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Desktops', exact: true })).toBeVisible();
  await expect(page.locator('.product-item')).not.toHaveCount(0);

  const product = page.locator('.product-item').filter({hasText: 'Build your own expensive computer'});
  await expect(product).toBeVisible();

  const catalogPriceText = await product.locator('.price.actual-price').innerText();
  console.log(`Catalog price: ${catalogPriceText}`);

  await page.getByRole('link', { name: 'Build your own expensive computer', exact: true }).click();
  const productTitle = await page.locator('.product-name').innerText();
  console.log(`Product title: ${productTitle}`);

  await expect(page.locator('.product-name')).toHaveText('Build your own expensive computer');

  const productAvailability = await page.locator('.stock .value').innerText();
  console.log(`Product availability: ${productAvailability}`);
  expect(productAvailability).toContain('In stock');

  
  await page.getByRole('radio', { name: 'Fast [+100.00]' }).check();
  await page.getByRole('radio', { name: '8GB [+60.00]' }).check();
  await page.getByRole('radio', { name: '400 GB [+100.00]' }).check();
  await page.getByRole('checkbox', { name: 'Image Viewer [+5.00]' }).check();
  await page.getByRole('checkbox', { name: 'Other Office Suite [+40.00]' }).check();

  await expect(page.getByRole('checkbox', { name: 'Office Suite [+100.00]' })).not.toBeChecked();
  
 









});
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

  await page.goto('https://demowebshop.tricentis.com/cart');
  const removeButtons = page.locator('input[name="removefromcart"]');
  const cartRowsCount = await page.locator('.cart-item-row').count();
  if (cartRowsCount > 0) {
    const count = await removeButtons.count();
    for (let i = 0; i < count; i++) {
      await removeButtons.nth(i).check();
    }
    await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();
    await expect(page.locator('.cart-item-row')).toHaveCount(0);
  }

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
  await page.getByRole('checkbox', { name: 'Office Suite [+100.00]' }).check();
  await expect(page.getByRole('checkbox', { name: 'Other Office Suite [+40.00]' })).not.toBeChecked();

  const basePrice = Number.parseFloat((await page.locator('.product-price').innerText()).replace(/[^0-9.]/g, ''));
  const expectedUnitPrice = basePrice + 100 + 60 + 100 + 5 + 100;
  console.log(`Expected unit price: ${expectedUnitPrice}`);

  await page.locator('#addtocart_74_EnteredQuantity').fill('2');
  await expect(page.locator('#addtocart_74_EnteredQuantity')).toHaveValue('2');
  await page.locator('#add-to-cart-button-74').click();

  await expect(page.getByText('The product has been added to your shopping cart', { exact: false })).toBeVisible();
  console.log('Configured product is added to cart');

  await page.locator('a.ico-cart').first().click();
  await expect(page).toHaveURL('https://demowebshop.tricentis.com/cart');

  const configuredRow = page.locator('.cart-item-row')
    .filter({ hasText: 'Build your own expensive computer' })
    .filter({ hasText: 'Software: Office Suite [+100.00]' })
    .last();

  await expect(configuredRow).toBeVisible();
  await expect(configuredRow).toContainText('Processor: Fast [+100.00]');
  await expect(configuredRow).toContainText('RAM: 8GB [+60.00]');
  await expect(configuredRow).toContainText('HDD: 400 GB [+100.00]');
  await expect(configuredRow).toContainText('Software: Image Viewer [+5.00]');
  await expect(configuredRow).toContainText('Software: Office Suite [+100.00]');

  const quantityField = configuredRow.locator('input[name^="itemquantity"]').first();
  await expect(quantityField).toHaveValue('2');

  const unitPriceText = await configuredRow.locator('.unit-price').innerText();
  const subtotalText = await configuredRow.locator('.subtotal').innerText();
  const unitPrice = Number.parseFloat(unitPriceText.replace(/[^0-9.]/g, ''));
  const subtotal = Number.parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
  const quantity = Number.parseInt(await quantityField.inputValue(), 10);
  const expectedSubtotal = unitPrice * quantity;

  expect(unitPrice).toBe(expectedUnitPrice);
  expect(subtotal).toBe(expectedSubtotal);
  console.log(`Cart unit price: ${unitPriceText}; subtotal: ${subtotalText}`);

  await configuredRow.locator('input[name="removefromcart"]').check();
  await page.getByRole('button', { name: 'Update shopping cart', exact: true }).click();

  await expect(page.locator('.cart-item-row')
    .filter({ hasText: 'Build your own expensive computer' })
    .filter({ hasText: 'Software: Office Suite [+100.00]' }))
    .toHaveCount(0);
  console.log('Configured computer is removed from the cart');
});

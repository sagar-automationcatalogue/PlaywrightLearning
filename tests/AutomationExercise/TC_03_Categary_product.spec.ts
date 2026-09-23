import {expect, test} from '@playwright/test'
test("TC_03_Category and Brands", async({page})=>{

    await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (
            url.includes('googleads') ||
            url.includes('googlesyndication') ||
            url.includes('doubleclick') ||
            url.includes('googletagservices') ||
            url.includes('adservice.google') ||
            url.includes('google_vignette')
        ) {
            await route.abort();
        }
        else {
            await route.continue();
        }
    });

    await page.goto('https://www.automationexercise.com/');
    //step -1 - Open the home page.
    await expect(page).toHaveURL('https://www.automationexercise.com/');
    await console.log("Home page loaded successfully");
    await page.locator(`//div[@class='panel-group category-products']`).isVisible();
    await console.log("Category section is available");
    const cat_locator=await page.locator(`//div[@id='accordian']//a[@data-parent='#accordian']`);
    console.log("total number of records found", await cat_locator.count());
    //step 2 - Verify Category section is visible on the left sidebar.
    console.log("=============================");
    for(let i=0; i<await cat_locator.count();i++)
    {
        const text_option=await cat_locator.nth(i).innerText();        
        if(text_option=='WOMEN'||text_option=='MEN'||text_option=='KIDS')
        {
            console.log(text_option, 'is present');
        }
    }
    //Step 3 - Verify Brands section is visible.
    await page.locator('.brands_products').isVisible();
    console.log("**************Brands link is visisble on the page************");

    //Step 4 - Expand Women category.
    await page.locator(`//a[@href='#Women']`).click();

    //Step 5 - Verify Dress, Tops and Saree subcategories are visible.
    let dress_subcategory=(await page.locator(`//div[@id='Women']//li/a`).first().innerText()).trim();
    expect(dress_subcategory).toBe('DRESS')
    console.log("Dress subcategory is verified in the Women's section");
    dress_subcategory=(await page.locator(`//div[@id='Women']//li/a`).nth(1).innerText()).trim();
    expect(dress_subcategory).toBe('TOPS')
    console.log("TOPS subcategory is verified in the Women's section");
    dress_subcategory=(await page.locator(`//div[@id='Women']//li/a`).last().innerText()).trim();
    expect(dress_subcategory).toBe('SAREE')
    console.log("SAREE subcategory is verified in the Women's section");

    //Step 6 -Click Tops.
    await page.locator(`//a[@href='#Women']`).click();
    await page.locator(`//div[@id='Women']//li/a[text()='Tops ']`).click();
    const tops_title_locator1=await page.locator(`//div[@class='features_items']/h2`);
    expect(tops_title_locator1).toHaveText("Women - Tops Products");    

    //Step 7 - Verify category heading indicates Women - Tops products.
    await page.locator(`//a[@href='#Women']`).click();
    await page.locator(`//div[@id='Women']//li[2]`).click();
    const tops_title_locator=await page.locator(`//div[@class='features_items']/h2`);
    expect(tops_title_locator).toHaveText("Women - Tops Products");
    console.log(`tops title contains message: `,await tops_title_locator.innerText())
    
    
    //Step 8 - Capture all visible product names under Women Tops.
    /*const women_products=await page.locator(`//div[@class='features_items']//div[@class='productinfo text-center']/p`);
    console.log("Following are the women's products displayed on the page");
    for(let i=0; i<await women_products.count(); i++)
    {
      
        const Womens_prod=await women_products.nth(i).innerText();
        console.log(Womens_prod);

    }*/

        const women_products = page.locator(`//div[@class='features_items']//div[@class='productinfo text-center']/p`);
        const womens_prod_list = await women_products.allInnerTexts();
        console.log("Following are the women's products displayed on the page", womens_prod_list);

    //Step 9 - Verify one or more products exist.
    expect(womens_prod_list.length).toBeGreaterThan(0);
    console.log(`Total products displayed: ${womens_prod_list.length}`);
   
    //Step 10 - Capture current URL.
    const Current_pageURL=await page.url();
    console.log("Current URL of the page : - ", Current_pageURL);

    //Step 11 - Expand Men category.
    await page.locator(`//div[@class='panel-heading']//a[@href='#Men']`).click();
    const Men_subcategory=await page.locator(`#Men`)
    expect(Men_subcategory).toBeVisible();
    console.log("Men's sub-category panel is visible");

    //Step 12 - Click Jeans.
    await page.locator(`//li/a[text()='Jeans ']`).click();

    //Step 13 - Verify heading indicates Men - Jeans products.
   await expect(page.getByRole('link', { name: 'Jeans' })).toBeVisible();
    console.log("Mens Jeans page is visible");

    //Step 14 - Verify URL differs from Women Tops URL.
    const Men_Jeans_url=await page.url();
    console.log("Mens Jeans URL", Men_Jeans_url);
    if(Current_pageURL!=Men_Jeans_url)
    {
        console.log(`Both are not equal  MEns URL: ${Men_Jeans_url}, Women's URL: ${Current_pageURL}`);
    }

    //Step 15 - Capture all Men Jeans product names.
    const Men_product_list=await page.locator(`//div[@class='features_items']//div[@class='product-overlay']//p`).allInnerTexts();
    console.log("Following are the Men's product list", Men_product_list);

    //Step 16 - Verify one or more Jeans products exist.
    expect(Men_product_list.length).toBeGreaterThan(0);
    console.log(`Total no of Men's products displayed ${Men_product_list.length}`);
    
    //Step 17 - Click Products to return to full product catalog.
    await page.locator(`//ol//a`).click();
    const Product_page=await page.locator(`//h2[text()='All Products']`);
    expect(Product_page).toBeVisible();
    console.log(`All Products page is displayed`);

    //Step 18 - Read all brand labels and counts from the sidebar.
    const All_Brands=await page.locator(`//div[@class='brands_products']//li//a`).allTextContents();
    console.log(`Following are the list of Brands:\n${All_Brands.join('\n')}`);

    //Step 19 - Verify Polo is present.
    let brand_polo = (await page.getByRole('link', { name: 'Polo' }).textContent()) ?? '';
        brand_polo = brand_polo.replace(/\(\d+\)/, '').trim();
        expect(brand_polo).toBe('Polo');
        console.log(`${brand_polo}, exisits on the page`);
    //Step 20 - Verify H&M is present.
    let brand_hm = (await page.getByRole('link', { name: 'H&M' }).textContent()) ?? '';
        brand_hm = brand_hm.replace(/\(\d+\)/, '').trim();
        expect(brand_hm).toBe('H&M');
        console.log(`${brand_hm}, exisits on the page`);
    //Step 21 - Click Polo.
    await page.getByRole('link', { name: 'Polo' }).click();
    await page.locator(`//span[text()='Polo']`).isVisible();
    console.log("Polo products page is displayed on the screen");

    //Step 22- Verify heading indicates Brand - Polo Products.

    const brandHeading = (await page.locator('h2.title.text-center').textContent()) ?? '';
    const normalizedHeading = brandHeading.replace(/\s+/g, ' ').trim();
    console.log(`Heading text: ${normalizedHeading}`);
    expect(normalizedHeading).toBe('Brand - Polo Products');

    //Step 23 - Capture all Polo product names.
    let polo_products=await page.locator(`//div[@class='col-sm-9 padding-right']//div//div[@class='col-sm-4']//img//following-sibling::p`).allInnerTexts();
    console.log("Following are the polo products displayed on the page")
    console.log(polo_products);

    //Step 24 - Verify at least one product exists.
    expect(polo_products.length).toBeGreaterThan(0);
    console.log(`Total products displayed: ${polo_products.length}`);

    //Step 25 - Click H&M from Brands sidebar.
    await page.locator(`//a[text()="H&M"]`).click();
    let HM_page=await page.locator(`//h2[text()='Brand - H&M Products']`).innerText();
    console.log(`H&M page displayed with title ${HM_page}`);

    //Step 26 - Verify heading indicates Brand - H&M Products.
    expect(HM_page).toBe('Brand - H&M Products');
    console.log(`H&M page displayed with title ${HM_page}`);

    //Step 27 - Capture all H&M product names.
    let HM_productnames= await page.locator(`//div[@class='col-sm-9 padding-right']//div//div[@class='col-sm-4']//img//following-sibling::p`).allInnerTexts();
    console.log("Following are the H&M products displayed on the page");
    console.log(HM_productnames);

    //Step 28 - Verify result collection is non-empty.
    expect(HM_productnames.length).toBeGreaterThan(0);
    console.log("Validated H&M products are displayed on the page");

    //Step 29 - Verify brand URL/heading changed from Polo to H&M.
    // Step - Click H&M brand link
await page.getByRole('link', { name: 'H&M' }).click();

// Verify URL changed to H&M brand page
await expect(page).toHaveURL(/brand_products\/H(%26|&)M/i);
console.log(`Current URL: ${page.url()}`);

// Verify heading indicates Brand - H&M Products
let brandHeading1 = (await page.locator('h2.title.text-center').textContent()) ?? '';
 brandHeading1 = brandHeading1.replace(/\s+/g, ' ').trim();

console.log(`Heading text: ${normalizedHeading}`);
expect(brandHeading1).toBe('Brand - H&M Products');

// Step 30 - Return to All Products.
await page.locator(`//a[text()='Products']`).click();
let all_productspg= await page.locator(`//h2[text()='All Products']`).innerText();
expect(all_productspg).toBe('All Products');
console.log(`${all_productspg} page is displayed`);

//Step 31 - Verify Category and Brands components are still usable after navigation.
await page.locator(`//h2[text()='Category']`).isVisible();
console.log("Categary components are displayed after navigating back to the products page")

await page.locator(`//h2[text()='Brands']`).isVisible();
console.log("Brand components are displayed after navigating back to the products page")

})
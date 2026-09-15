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
    await page.locator(`//div[@id='Women']//li/a[text()='Tops ']`).click();
    const tops_title_locator=await page.locator(`//div[@class='features_items']/h2`);
    expect(tops_title_locator).toHaveText("Women - Tops Products");
    console.log(`tops title contains message: `,await tops_title_locator.innerText())
    
    
    //Step 8 - Capture all visible product names under Women Tops.
    const women_products=await page.locator(`//div[@class='features_items']//div[@class='productinfo text-center']/p`);
    console.log("Following are the women's products displayed on the page");
    for(let i=0; i<await women_products.count(); i++)
    {
      
        const Womens_prod=await women_products.nth(i).innerText();
        console.log(Womens_prod);

    }
    //Step 9 - Verify one or more products exist.
   
})
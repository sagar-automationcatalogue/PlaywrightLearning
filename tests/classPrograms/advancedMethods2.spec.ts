import {test} from'@playwright/test';

test(`Playwright advanced methods`, async({page}) =>{
    await page.goto(`https://playwrightlab.github.io/`);

    await page.locator(`//div[@data-testid='hover-card']//button[@id='doubleClickBtn']`).dblclick();
    let message = await page.getByTestId(`hover-card`).locator(`//span[@id='doubleClickResult']`).innerText();
    console.log(message);

    await page.locator(`//div[@id='rightClickDemo']/button[@class='btn btn-outline']`).click({button:'right'});
    let message1 = await page.locator(`#rightClickResult`).textContent();
    console.log(message1);

    //Custom Drop-down
    await page.locator(`//div[@id='customDropdown']`).click();
    const locators = await page.locator(`//ul[@id='customDropdownMenu']/li`);
    console.log(`Total Number of locators found ${locators.count()}`);

    for(let i=0;i<await locators.count();i++){
        let dropdownText = await locators.nth(i).innerText();
        if(dropdownText === 'Critical'){
            await locators.nth(i).click(); 
        }
    }
    await page.waitForTimeout(3000);
})
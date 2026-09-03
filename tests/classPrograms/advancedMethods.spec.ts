import {test} from '@playwright/test';

test(`Learning some Advanced playwright methods`, async({page})=>{
    await page.goto(`https://playwrightlab.github.io/`);
    let title = await page.title();
    console.log(`Title of the application is ${title}`);

    await page.locator(`//div[@class='nav-container']/ul/li/a`).hover();
    await page.waitForTimeout(2000);
    await page.locator(`//div[@class='nav-container']//a[@data-testid='nav-network']`).click();
    let networkMessage = await page.locator(`//p[@id='networkDesc']`).innerText();
    console.log(networkMessage);

    await page.getByTestId(`tooltip-btn`).hover();
    let tooltip = await page.locator(`//div[@id='customTooltip']`).textContent();
    console.log(tooltip);
    await page.waitForTimeout(4000);
})
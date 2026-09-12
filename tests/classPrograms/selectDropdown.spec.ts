import {test} from '@playwright/test';

test(`Drop-down selection for searchable city`, async({page})=>{

    let expectedCity='Sydney';

    await page.goto(`https://playwrightlab.github.io/`);

    const dropdown_locator = await page.locator(`//input[@class='searchable-dropdown-input'][@id='searchableDropdownInput']`)
    await dropdown_locator.click();
    await dropdown_locator.fill(`Mum`);

    await page.locator(`//li[@data-value='mumbai'][text()='Mumbai']`).click();

    let dropdowntext = await page.getByTestId(`searchable-dropdown-result`).innerText();
    console.log(`Selected dropdown value is ${dropdowntext}`);

    await page.waitForTimeout(2000);
    await dropdown_locator.clear();
    await page.waitForTimeout(2000);

    await dropdown_locator.fill(expectedCity);
    const allLocatorOptions = await page.locator(`//ul[@id='searchableDropdownMenu']/li[not(contains(@class,'hidden'))]`);
    console.log(`Total Number of cities are displayed are ${await allLocatorOptions.count()}`)

    for(let i=0;i<await allLocatorOptions.count();i++){
        const actualCityName = await allLocatorOptions.nth(i).innerText();
        console.log(actualCityName);

        if(actualCityName.toLowerCase().includes(expectedCity.toLowerCase())){
            //await allLocatorOptions.nth(i).click();
            //break;
            console.log(`City name is found`)
        }else{
            console.log(`City name is not found`)
        }

        /*if(actualCityName.toLowerCase().includes(expectedCity.toLowerCase())){
            console.log(`${actualCityName} --> matched`);
        }else{
            console.log(`${actualCityName} --> not matched`);
        }*/

    }

    await page.waitForTimeout(4000);

})
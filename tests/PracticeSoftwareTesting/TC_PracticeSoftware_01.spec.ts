import {expect, test} from '@playwright/test';

test(`TC_PracticeSoftware_01: Invalid Login → Valid Login → Account → Logout`, async({page}) =>{

    await page.goto(`https://practicesoftwaretesting.com/`);

    const titilepage = await page.title()

    console.log(titilepage);
});

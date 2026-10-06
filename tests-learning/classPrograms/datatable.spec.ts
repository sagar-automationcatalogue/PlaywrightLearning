import {test} from '@playwright/test';

test(`Data Table learning`, async({page}) =>{

    await page.goto(`https://playwrightlab.github.io/`);
    await page.getByRole(`heading`, {name: ` User Management`}).scrollIntoViewIfNeeded();
    //To Print total number of rows
    let rows_locator = await page.locator(`//table[@id='dataTable']/tbody/tr`);
    let numberofRows = await rows_locator.count();
    console.log(`Number of rows in a table : ${numberofRows}`);

    //To Print total number of columns
    let columns_locator = await page.locator(`//table[@id='dataTable']/tbody/tr[1]/td`);
    console.log(`Total number of columns is ${await columns_locator.count()}`)

    //To print second row and third column data
    let namee = await page.locator(`//table[@id='dataTable']/tbody/tr[2]/td[3]`).innerText();
    console.log(`Name of the user is ${namee}`);

    //To print thrid row and fourth column data
    let emaill = await page.locator(`//table[@id='dataTable']/tbody/tr[3]/td[4]`).innerText();
    console.log(`Email of the user is ${emaill}`);

    /*//To Print the entire second row data
    let row_second_data = await page.locator(`//table[@id='dataTable']/tbody/tr[2]/td`);

    for(let i=1;i<await row_second_data.count()-1;i++){
        let data = await row_second_data.nth(i).innerText();
        console.log(data);
    }

    //To Print the entire third row data
    let row_third_data = await page.locator(`//table[@id='dataTable']/tbody/tr[3]/td`);

    for(let i=1;i<await row_third_data.count()-1;i++){
        let data = await row_third_data.nth(i).innerText();
        console.log(data);
    }

    //To Print the entire fourth row data
    let row_fourth_data = await page.locator(`//table[@id='dataTable']/tbody/tr[4]/td`);

    for(let i=1;i<await row_fourth_data.count()-1;i++){
        let data = await row_fourth_data.nth(i).innerText();
        console.log(data);
    }*/

    //To Print entire Data tables data (All rows and all Columns)
    for(let k=1;k<numberofRows;k++){
        let row_data = await page.locator(`//table[@id='dataTable']/tbody/tr[${k}]/td`);

        for(let i=1;i<await row_data.count()-1;i++){
            let data = await row_data.nth(i).innerText();
            console.log(data);
        }
    }

    //To Print the Charlie brown role data
    for(let k=1;k<numberofRows;k++){
        let name_user = await page.locator(`//table[@id='dataTable']/tbody/tr[${k}]/td[3]`).innerText();
        if(name_user == `Charlie Brown`){
             await page.locator(`//table[@id='dataTable']/tbody/tr[${k}]/td[7]/button[1]`).click();
            
        }
    }


    /*let id = await row_second_data.nth(1).innerText();
    console.log(id);
    let name = await row_second_data.nth(2).innerText();
    console.log(name);
    let email = await row_second_data.nth(3).innerText();
    console.log(email);
    let role = await row_second_data.nth(4).innerText();
    console.log(role);
    let status = await row_second_data.nth(5).innerText();
    console.log(status);*/
    
    await page.waitForTimeout(4000);
})
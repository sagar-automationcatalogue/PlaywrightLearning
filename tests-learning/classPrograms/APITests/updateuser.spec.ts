import {expect, test} from '@playwright/test'

test(`Update user name`, async({request}) =>{
    let response = await request.put(`https://automationexercise.com/api/updateAccount`,{
        multipart:{
            name: `Playwright Automation`,
            email:`autmationcatalogue123@gmail.com`,
            password: `test@123`
        }
    })
    let responseBody = await response.json();
    console.log(responseBody);
    console.log(responseBody.message);
    expect(responseBody.message).toBe(`User updated.`)
})
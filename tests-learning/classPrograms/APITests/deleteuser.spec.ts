import {expect, test} from '@playwright/test'

test(`Delete user name`, async({request}) =>{
    let response = await request.delete(`https://automationexercise.com/api/deleteAccount`,{
        multipart:{            
            email:`autmationcatalogue123@gmail.com`,
            password: `test@123`
        }
    })
    let responseBody = await response.json();
    console.log(responseBody);
    console.log(responseBody.message);
    expect(responseBody.message).toBe(`Account deleted!`)
})
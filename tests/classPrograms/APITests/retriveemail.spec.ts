import {expect, test} from '@playwright/test';

test(` Retriveing user information by email`, async({request})=>{
    let response = await request.get(`https://automationexercise.com/api/getUserDetailByEmai`,{
        params:{
            email:`autmationcatalogue123@gmail.com`
        }
    })
    console.log(response.status());
    console.log(response.statusText());

    expect(response.status()).toBe(200);
    let responseBody = await response.json();
    //console.log(responseBody);
    console.log(responseBody.user.company);
    console.log(responseBody.user.birth_year);
})
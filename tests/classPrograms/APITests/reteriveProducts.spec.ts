import {test, expect} from '@playwright/test'

test(`Retrive all Products-GET Request`, async({request})=>{
    let response = await request.get(`https://automationexercise.com/api/productsList`);
    console.log(`Status code is ${response.status()}`);
    console.log(`Status Text is ${response.statusText()}`);

    expect(response.status()).toBe(200);
    console.log(`Request is successful & Response is retrived`)

    let responseBody = await response.json();
    console.log(responseBody);
    console.log(responseBody.responseCode);
    console.log(responseBody.products[0].name);
    console.log(responseBody.products[4].price);
    console.log(responseBody.products[10].category.usertype.usertype);
    console.log(`Total Number of Products in the responsebody is: ${responseBody.products.length}`)
});
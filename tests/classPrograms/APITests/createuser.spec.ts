import {test, expect} from '@playwright/test'

test(`Retrive all Products-GET Request`, async({request})=>{
    let response = await request.post(`https://automationexercise.com/api/createAccount`,
        {
            multipart:{
                name: `test rao`,
                email: `pullarao.test003@gmail.com`,
                password:`test@1234`,
                title: `Mr`,
                birth_date:`12`,
                birth_month: `10`,
                birth_year:`1990`,
                firstname: 'pulla rao',
                lastname:`testing`,
                company:`google`,
                address1:`kukatpally`,
                address2:`Hyderabad`,
                country:`India`,
                zipcode: `500072`,
                state:`Telangana`,
                city:`Hyderabad`,
                mobile_number:`9988889900`
            }
        }
    );
    console.log(response.status());
    console.log(response.statusText());

    let responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody.message).toBe(`User created!`);
    console.log(`User is created successfully`)
});
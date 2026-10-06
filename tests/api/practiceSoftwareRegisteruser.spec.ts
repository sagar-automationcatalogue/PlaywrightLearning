import {expect, test} from '@playwright/test'

test(`Register user in Practice Software testing`, async({request}) =>{
    let response = await request.post(`https://api.practicesoftwaretesting.com/users/register`,{
        data:{            
            "first_name": "Sagar",
            "last_name": "Automation",
            "address": {
                "street": "Kukatpally",
                "house_number": "12",
                "city": "City",
                "state": "State",
                "country": "Country",
                "postal_code": "1234AA"
            },
            "phone": "8855996600",
            "dob": "1990-12-12",
            "password": "SagarAutomation@123",
            "email": "sagar.api999@gmail.com"
        }
    })
    let responseBody = await response.json();
    console.log(responseBody);
    console.log(response.status()+" - " + response.statusText());
    
})
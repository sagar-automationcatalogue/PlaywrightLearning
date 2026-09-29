import {expect, test} from '@playwright/test'

test(`Login API for Practice Software Testing`, async({request}) =>{
    let response = await request.post(`https://api.practicesoftwaretesting.com/users/login`,{
        headers:{
            'Content-Type':`application/json`,
            Accept:`application/json`
        },
        data:{
            email:`sagar.api999@gmail.com`,
            password:`SagarAutomation@123`
        }
    });
    console.log(response);
    let responseBody = await response.json();
    console.log(responseBody);
    let accessToken = responseBody.access_token;
    console.log(accessToken);
})

test(`Logged In User`, async({request}) =>{
    let response = await request.get(`https://api.practicesoftwaretesting.com/users/me`,{
        headers:{
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5wcmFjdGljZXNvZnR3YXJldGVzdGluZy5jb20vdXNlcnMvbG9naW4iLCJpYXQiOjE3OTA2NDc2NzUsImV4cCI6MTc5MDY0Nzk3NSwibmJmIjoxNzkwNjQ3Njc1LCJqdGkiOiJzNWgyVDZ6enFJSDlPSU5VIiwic3ViIjoiMDFtM25lZDJoM2VkMHhtMHlkYXR0NDhzcnkiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3Iiwicm9sZSI6InVzZXIifQ.7dtgFul0wMOOXFGTJZ3lsyygMVDwYaPJZWPUcNeN-Nk`,
            Accept:`application/json`
        }
        
    });
    console.log(response);
    let responseBody = await response.json();
    console.log(responseBody);

})

test(`Update User`, async({request}) =>{
    let response = await request.patch(`https://api.practicesoftwaretesting.com/users/01m3ned2h3ed0xm0ydatt48sry`,{
        headers:{
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5wcmFjdGljZXNvZnR3YXJldGVzdGluZy5jb20vdXNlcnMvbG9naW4iLCJpYXQiOjE3OTA2NDc2NzUsImV4cCI6MTc5MDY0Nzk3NSwibmJmIjoxNzkwNjQ3Njc1LCJqdGkiOiJzNWgyVDZ6enFJSDlPSU5VIiwic3ViIjoiMDFtM25lZDJoM2VkMHhtMHlkYXR0NDhzcnkiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3Iiwicm9sZSI6InVzZXIifQ.7dtgFul0wMOOXFGTJZ3lsyygMVDwYaPJZWPUcNeN-Nk`,
            Accept:`application/json`
        },
        data:{            
            "first_name": "kamesh",
            "last_name": "testing",
            "address": {
                "street": "KPHB Road",
                "house_number": "123",
                "city": "Hyderabad",
                "state": "Telangana",
                "country": "India",
                "postal_code": "500072"
            },
            "password": "SagarAutomation@123",
            "email": "sagar.api999@gmail.com"
        }
        
    });
    console.log(response);
    let responseBody = await response.json();
    console.log(responseBody);

})
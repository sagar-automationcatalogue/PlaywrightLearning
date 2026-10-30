import {request, test, expect} from '@playwright/test';
import { UserService } from '../../src/apis/UserService';
import { UserBuilder } from '../../src/builders/UserBuilder';

test(`Registering UserName in PracticeSoftware`, async({request})=>{
    let ob_UserService = new UserService(request);
    let response = await ob_UserService.registerUser(UserBuilder.registerUser());

    let responseBody = await response.json();
    console.log(responseBody);

    await ob_UserService.verifyRegisterResponse(responseBody);
    
})


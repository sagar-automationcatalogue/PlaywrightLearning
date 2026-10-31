import {test} from '@playwright/test';
import { Contacts } from '../../src/apis/Thinking-Tester-Contact';
import { ThinkingTesterUserBuilder } from '../../src/builders/Thinking-tester-UserBuilder';
import { PlaywrightUtils } from '../../src/utils/PlaywrightUtils';
import { thinkingBaseURL } from '../../src/config/EnvironmentConfig';
import { ThinkingTester_LoginPage } from '../../src/pages/ThinkinTester_LoginPage';

test(`Thinking Tester - Contact lifecycle-Contact List App`, async({page, request})=>{
    //1-Create a fresh user with POST /users (test setup)
    let ob_Contacts = new Contacts(request);
    let response = await ob_Contacts.createUser(ThinkingTesterUserBuilder.createUser());

    let responseBody = await response.json();
    let accessToken = responseBody.token;
    console.log(accessToken);
    console.log(responseBody.user.firstName);
    console.log(responseBody.user.lastName);
    console.log(responseBody.user.email);

    //2-Log in with that user
    await PlaywrightUtils.navigateToURL(page, thinkingBaseURL);
    let ob_ThinkingTeserLoginPage = new ThinkingTester_LoginPage(page);
    ob_ThinkingTeserLoginPage.login_ThinkingTester(responseBody.user.email, 'test@123');

    await page.waitForTimeout(4000);

});
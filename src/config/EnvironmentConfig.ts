import 'dotenv/config';

const automationExerciseBaseURL = process.env.automationExercise_UI_baseURL? process.env.automationExercise_UI_baseURL : 'https://www.automationexercise.com/';
const demoWebShopBaseURL = process.env.demoWebShop_UI_baseURL? process.env.demoWebShop_UI_baseURL : 'https://demowebshop.tricentis.com/';
const expandTestingBaseURL = process.env.expandTesting_UI_baseURL? process.env.expandTesting_UI_baseURL : 'https://practice.expandtesting.com/';
const orangeHRMBaseURL = process.env.orangeHRM_UI_baseURL? process.env.orangeHRM_UI_baseURL : 'https://automaetesting-trials821.orangehrmlive.com/';
const sauceDemoBaseURL = process.env.sauceDemo_UI_baseURL? process.env.sauceDemo_UI_baseURL : 'https://www.saucedemo.com/';
const practiceSoftwareTestingBaseURL = process.env.practiceSoftwareTesting_UI_baseURL? process.env.practiceSoftwareTesting_UI_baseURL : 'https://practicesoftwaretesting.com/';
const practiceSoftwareTestingAPIBaseURL = process.env.practiceSoftwareTesting_API_baseURL? process.env.practiceSoftwareTesting_API_baseURL : 'https://api.practicesoftwaretesting.com/users/';
const automationExerciseAPIBaseURL = process.env.automationExercise_API_baseURL? process.env.automationExercise_API_baseURL : 'https://automationexercise.com/api/';

if (!automationExerciseBaseURL || !demoWebShopBaseURL || !expandTestingBaseURL || !orangeHRMBaseURL
     || !sauceDemoBaseURL || !practiceSoftwareTestingBaseURL || !practiceSoftwareTestingAPIBaseURL || !automationExerciseAPIBaseURL) {
  throw new Error('One or more required environment variables are not set');
}

export { automationExerciseBaseURL, demoWebShopBaseURL, expandTestingBaseURL, orangeHRMBaseURL, sauceDemoBaseURL, 
    practiceSoftwareTestingBaseURL, practiceSoftwareTestingAPIBaseURL, automationExerciseAPIBaseURL };

export const joinBaseURL = (baseURL: string, endpoint: string): string =>
    `${baseURL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
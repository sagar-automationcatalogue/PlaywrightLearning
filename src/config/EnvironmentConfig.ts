import 'dotenv/config';

const automationExerciseBaseURL = process.env.automationExercise_UI_baseURL;

const demoWebShopBaseURL = process.env.demoWebShop_UI_baseURL;
const expandTestingBaseURL = process.env.expandTesting_UI_baseURL;
const orangeHRMBaseURL = process.env.orangeHRM_UI_baseURL;
const sauceDemoBaseURL = process.env.sauceDemo_UI_baseURL;
const practiceSoftwareTestingBaseURL = process.env.practiceSoftwareTesting_UI_baseURL;
const practiceSoftwareTestingAPIBaseURL = process.env.practiceSoftwareTesting_API_baseURL;
const automationExerciseAPIBaseURL = process.env.automationExercise_API_baseURL;

if (!automationExerciseBaseURL || !demoWebShopBaseURL || !expandTestingBaseURL || !orangeHRMBaseURL
     || !sauceDemoBaseURL || !practiceSoftwareTestingBaseURL || !practiceSoftwareTestingAPIBaseURL || !automationExerciseAPIBaseURL) {
  throw new Error('One or more required environment variables are not set');
}

export { automationExerciseBaseURL, demoWebShopBaseURL, expandTestingBaseURL, orangeHRMBaseURL, sauceDemoBaseURL, 
    practiceSoftwareTestingBaseURL, practiceSoftwareTestingAPIBaseURL, automationExerciseAPIBaseURL };
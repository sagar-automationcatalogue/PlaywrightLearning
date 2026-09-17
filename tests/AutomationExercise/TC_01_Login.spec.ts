import {expect, test} from '@playwright/test';

test(`TC_01_Login: Invalid Login → Valid Login → Logout → Protected State Validation`, async({page, browserName}) =>{
    test.slow();
    if(browserName === 'webkit'){
        test.slow();
        //test.setTimeout(90_000);
    }
    // =========================================================
    // Ignore / Block Google Advertisements
    // Keep this before page.goto()
    // =========================================================
    await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (
            url.includes('googleads') ||
            url.includes('googlesyndication') ||
            url.includes('doubleclick') ||
            url.includes('googletagservices') ||
            url.includes('adservice.google') ||
            url.includes('google_vignette')
        ) {
            await route.abort();
        }
        else {
            await route.continue();
        }
    });

    await page.goto(`https://www.automationexercise.com/`);
    console.log(`Home page is loaded successfully`);
    const homeLink = page.getByRole('link', { name: 'Home' });
    const productsLink = page.locator(`//a[text()=' Products']`);
    const cartLink = page.locator(`//a[@href='/view_cart']`).first();
    const signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    await expect(homeLink).toBeVisible();
    await expect(productsLink).toBeVisible();
    await expect(cartLink).toBeVisible();
    await expect(signupLoginLink).toBeVisible();
    console.log(`Home, Products, Cart and Signup/Login navigation are visible`);
    await signupLoginLink.click();
    const loginForm = page.getByText(`Login to your account`);
    await expect(loginForm).toBeVisible();
    const newUserSignup = page.getByText(`New User Signup!`);
    await expect(newUserSignup).toBeVisible();
    console.log(`Signup/Login page opened successfully`);
    const emailField = page.locator(`//input[@data-qa='login-email']`);
    const passwordField = page.locator(`//input[@data-qa='login-password']`);
    await expect(emailField).toBeVisible();
    await expect(emailField).toBeEnabled();
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
    console.log('Email and password fields are visible and enabled');
    await emailField.fill('sagar.automationcatalogue8@gmail.com');
    expect(await emailField.inputValue()).toBe('sagar.automationcatalogue8@gmail.com');
    console.log('Registered email entered successfully');
    await passwordField.fill('WrongPassword@123');
    expect(await passwordField.inputValue()).toBe('WrongPassword@123');
    console.log('Invalid password entered');
    const loginButton = page.locator(`//button[@data-qa='login-button']`);
    await loginButton.click();
    console.log('Login submitted with invalid password');
    const loginError = page.getByText('Your email or password is incorrect!');
    await expect(loginError).toBeVisible();
    console.log('Invalid login error is displayed');
    expect(page.url()).toContain('/login');
    console.log('User remains on the Login page');
    await emailField.fill('');
    await passwordField.fill('');
    expect(await emailField.inputValue()).toBe('');
    expect(await passwordField.inputValue()).toBe('');
    console.log('Email and password fields are cleared');
    await emailField.fill('sagar.automationcatalogue8@gmail.com');
    expect(await emailField.inputValue()).toBe('sagar.automationcatalogue8@gmail.com');
    console.log('Registered email entered again successfully');
    await passwordField.fill('Admin@123');
    expect(await passwordField.inputValue()).toBe('Admin@123');
    console.log('Valid password entered successfully');
    await loginButton.click();
    console.log('Login submitted with valid credentials');
    const loggedInAs = page.getByText('Logged in as');
    await expect(loggedInAs).toBeVisible();
    console.log('Logged in as is visible');
    await expect(page.getByText('Logout')).toBeVisible();
    console.log('Logout navigation is visible');
    await productsLink.click();
    console.log('Navigated to Products page');
    await expect(page).toHaveURL(`https://www.automationexercise.com/products`);
    console.log(`All products page is loaded`);
    await expect(loggedInAs).toBeVisible();
    console.log('Authenticated navigation state is shown');
    await page.locator('//a[contains(@href, "/logout")]').click();
    console.log('Logout clicked');
    await expect(signupLoginLink).toBeVisible();
    await expect(page).toHaveURL(`https://www.automationexercise.com/login`);
    await expect(loginForm).toBeVisible();
    console.log("User is navigated to login page and Login form is displayed");
    await expect(loggedInAs).not.toBeVisible();
    console.log('Authentication state is removed');
    await page.goBack();
    console.log(`Browser Back navigation performed`);
    await expect(loggedInAs).not.toBeVisible();
    await expect(signupLoginLink).toBeVisible();
    console.log(`Logged-out state remains after browser back`);
});
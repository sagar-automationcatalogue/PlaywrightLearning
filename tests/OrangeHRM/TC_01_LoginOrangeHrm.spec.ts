import {expect,test} from '@playwright/test';
 
test('TC_OrangeHRM_01_Invalidz Login → Valid Login → Dashboard → Logout',async({page})=>{
    test.setTimeout(120000);
   // Launch a browser and navigate to the OrangeHRM application.

    await page.goto(`https://automation44-trials8101.orangehrmlive.com`);
    //Verify the login page is displayed.

    await expect(page.locator(`.form-header`)).toBeVisible({timeout:20000});
    console.log(`Login page displayed`)
    //Verify the Username field is visible and enabled.
    const uname=await page.getByPlaceholder(`Username`);
    await uname.isVisible();
    await uname.isEnabled();
    await uname.fill(`admin`);
    //Verify the Password field is visible and enabled.
    const pwd=await page.getByPlaceholder(`Password`);
    await pwd.isVisible();
    await pwd.isEnabled();
    await pwd.fill(`Admin@123`);
    //Verify the Login button is visible and enabled.
    const loginbtn=await page.getByRole('button',{name:'Login'});
    await loginbtn.isVisible();
    await loginbtn.isEnabled();
    console.log("Login button is enabled")
    await loginbtn.click();
    //await page.waitForLoadState();
    await page.locator(`//span[text()='Log Out']`).click();
    console.log(`logout from the page`);
    //Enter username admin.
    await uname.fill('admin');
    const value=await uname.inputValue();
    console.log(`uname contains ${value}`);
    //Enter invalid password WrongPassword@123.
    await pwd.fill(`lav12345`);
    console.log(`Invalid  password entered`);
    //Click Login.
    await loginbtn.click();
    //Verify the invalid-credentials validation message.
    await expect(page.locator(`.toast-message`)).toBeVisible();
    console.log(`Invalid Login`);











});

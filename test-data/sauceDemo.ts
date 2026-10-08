export const TC_01_LoginMatrix = {
    standardUsername: 'standard_user',
    lockedOutUsername: 'locked_out_user',
    invalidUsername: 'Test12345',
    validPassword: 'secret_sauce',
    invalidPassword: '123456',
    emptyValue: '',
    errors: {
        usernameRequired: 'Epic sadface: Username is required',
        passwordRequired: 'Epic sadface: Password is required',
        invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
        lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
        protectedRoute: "Epic sadface: You can only access '/inventory.html' when you are logged in."
    }
}

export const TC_07_CheckoutInfo = {
    username: 'standard_user',
    password: 'secret_sauce',
    productName: 'Sauce Labs Bike Light',
    productId: 'sauce-labs-bike-light',
    firstName: 'Playwright',
    lastName: 'Student',
    postalCode: '500081',
    emptyValue: '',
    errors: {
        firstNameRequired: 'Error: First Name is required',
        lastNameRequired: 'Error: Last Name is required',
        postalCodeRequired: 'Error: Postal Code is required'
    }
}


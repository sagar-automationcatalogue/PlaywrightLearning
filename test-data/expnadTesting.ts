export const TC_01_LoginScenarios = {  
  invalidUsername: 'wrongUser',
  validUsername: 'practice',
  validPassword: 'SuperSecretPassword!',
  invalidPassword: 'WrongPassword'
}

export const TC_02_DynamicRegistration={
    registrationPassword:"Automation@123",
    mismatchPassword:"Automation@456",
    usernamePrefix:"student-",
    username:``,
    emptyValue:``,
    messages:{
        requiredFields:"All fields are required.",
        passwordsDoNotMatch:"Passwords do not match.",
        registrationSuccess:"Successfully registered, you can log in now.",
        loginSuccess:"You logged into a secure area!"
    }
}

export const TC_03_WebInputsFormValidations = {    
    emptyValue: ``,
    inputs: {
        number: `12345`,
        text: `Playwright Automation`,
        password: `Automation@123`,
        date: `2026-09-15`
    },
    formValidation: {
        contactName: `Playwright Student`,
        contactNumber: `012-3456789`,
        pickupDate: `2026-09-20`,
        paymentMethod: `cashondelivery`,
        requiredMessages: {
            contactName: `Please enter your Contact name.`,
            contactNumber: `Please provide your Contact number.`,
            pickupDate: `Please provide valid Date.`,
            paymentMethod: `Please select the Paymeny Method.`
        },
        successMessage: `Thank you for validating your ticket`
    },
    dropdownValues: {
        simple: `1`,
        elementsPerPage: `100`,
        country: `IN`
    }
}

export const TC_04_DynamicPagination = {
    searchKeyword: 'Female',
    pageSizes: {
        initial: '3',
        expanded: '5'
    },
    expectedHeaders: [
        'Student Name',
        'Gender',
        'Class Level',
        'Home State',
        'Major',
        'Extracurricular Activity'
    ],
    expectedColumnCount: 6
}
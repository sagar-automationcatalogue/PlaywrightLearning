export const TC_01_Login = {
    emailPrefix: 'playwright.login.',
    emailDomain: '@example.com',
    validPassword: 'W9!rL3#qV6$zP2@t',
    registration: {
        firstName: 'Playwright',
        lastName: 'Learner',
        dateOfBirth: '1995-05-15',
        postcode: '1010',
        houseNumber: '42',
        phone: '0123456789',
        street: 'Playwright Training Street',
        city: 'Vienna',
        state: 'Vienna',
        country: 'Austria',
        weakPassword: 'playwright'
    },
    invalidLoginPassword: 'WrongPassword@123',
    emptyValue: ''
}

export const TC_02_ProductSearch = {
    searchTerms: {
        primary: 'pliers',
        alternate: 'hammer'
    },
    sortByName: 'Name (A - Z)',
    sortByPrice: 'Price (Low - High)',
    emptyValue: ''
}

export const TC_03_ProductFilter = {
  category: 'Hand Tools',
  subcategory: 'Pliers',
  priceRange: {
    filteredMinimum: 10,
    filteredMaximum: 50,
    resetMinimum: 0,
    resetMaximum: 200
  }
}

export const TC_05_Favorites = {
    email: 'playwright.practice.learner@example.com',
    password: 'W9!rL3#qV6$zP2@t',
    registration: {
        country: 'Austria',
        firstName: 'Playwright',
        lastName: 'Learner',
        dateOfBirth: '1995-05-15',
        postcode: '1010',
        houseNumber: '42',
        phone: '0123456789',
        street: 'Playwright Training Street',
        city: 'Vienna',
        state: 'Vienna',
        weakPassword: 'playwright'
    },
    searchTerms: {
        firstProduct: 'Combination Pliers',
        secondProduct: 'Hammer'
    },
    emptyValue: ''
}

export const TC_06_ProductComparison = {
    searchTerm: 'pliers'
}

export const TC_07_MultiProductCart = {
    products: [
        { search: 'pliers', quantity: 1 },
        { search: 'Hammer', quantity: 1 },
    ],
    emptyCartQuantity: '1'
}

export const TC_08_CheckoutInvoice = {
    productName: 'Combination Pliers',
    quantity: '2',
    accountEmail: 'playwright.practice.learner@example.com',
    accountPassword: 'W9!rL3#qV6$zP2@t',
    shippingAddress: {
        street: '101 Playwright Automation Street',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postcode: '500081',
        houseNumber: '101'
    },
    paymentMethod: 'Cash on Delivery'
}

export const TC_09_ProfileManagement = {
    emailPrefix: 'playwright.profile.learner.',
    emailDomain: '@example.com',
    password: 'W9!rL3#qV6$zP2@t',
    registration: {
        country: 'Austria',
        firstName: 'Playwright',
        lastName: 'Learner',
        dateOfBirth: '1995-05-15',
        postcode: '1010',
        houseNumber: '42',
        phone: '0123456789',
        street: 'Playwright Training Street',
        city: 'Vienna',
        state: 'Vienna',
        weakPassword: 'playwright'
    },
    temporaryProfile: {
        firstName: 'Playwright',
        lastName: 'Automation',
        phone: '9876543210',
        street: '202 Playwright Profile Street',
        city: 'Hyderabad',
        state: 'Telangana',
        postcode: '500081'
    },
    passwordChange: {
        current: 'welcome01',
        new: 'Automation@456',
        confirmation: 'Automation@789'
    },
    emptyValue: ''
}

export const TC_10_ContactForm = {
    firstName: 'Playwright',
    lastName: 'Student',
    email: 'playwright.student@example.com',
    shortMessage: 'Short',
    message: 'I need help with an automated order placed through the Toolshop demo. Please confirm the expected delivery details.',
    invalidAttachment: {
        name: 'invalid.pdf',
        mimeType: 'application/pdf',
        content: '%PDF-1.4'
    },
    validAttachment: {
        name: 'automation-note.txt',
        mimeType: 'text/plain'
    },
    emptyValue: ''
}

export const TC_11_RegistrationPostcode = {
    emailPrefix: 'playwright.student.',
    emailDomain: '@example.com',
    country: 'Austria',
    registration: {
        firstName: 'Playwright',
        lastName: 'Student',
        dateOfBirth: '1995-05-15',
        postcode: '1010',
        houseNumber: '42',
        phone: '0123456789',
        street: 'Mock Automation Street',
        city: 'Mock City',
        state: 'Mock State',
        weakPassword: 'playwright'
    },
    validPassword: 'W9!rL3#qV6$zP2@t',
    emptyValue: ''
}

export const TC_12_ApiUiContract = {
    searchTerm: 'pliers'
}
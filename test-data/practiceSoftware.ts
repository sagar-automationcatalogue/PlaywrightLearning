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
    //emptyValue: ''
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
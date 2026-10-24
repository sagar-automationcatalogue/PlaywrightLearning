export const Constants = {
    emptyValue: '',
    AutomationExercise:{
        loginError:"Your email or password is incorrect!",        
        cartConfirmation:'Your product has been added to cart.',
        emptyCartMessage:'Cart is empty!',
        reviewSuccess:'Thank you for your review.'        
    },
    DemoWebShop:{        
        headings: {
            home: 'Welcome to our store',
            login: 'Welcome, Please Sign In!',
            account: 'My account - Customer info'
        },
        homeHeading: 'Welcome to our store',
        sortByName: 'Name: A to Z',
        sortByPrice: 'Price: Low to High',
        removeFilterLabel: 'Remove Filter',
        noProductsMessage: 'No products were found that matched your criteria.',
        shoppingCartHeading: 'Shopping cart',
        addToCartConfirmation: 'The product has been added to your shopping cart',
        emptyCartMessage: 'Your Shopping Cart is empty!',
        wishlistConfirmation: 'The product has been added to your wishlist'
    },
    ExpandTesting:{
        username:``,        
        messages:{
            requiredFields:"All fields are required.",
            passwordsDoNotMatch:"Passwords do not match.",
            registrationSuccess:"Successfully registered, you can log in now.",
            loginSuccess:"You logged into a secure area!"
        },
        formValidation: {
            requiredMessages: {
                contactName: `Please enter your Contact name.`,
                contactNumber: `Please provide your Contact number.`,
                pickupDate: `Please provide valid Date.`,
                paymentMethod: `Please select the Paymeny Method.`
            },
            successMessage: `Thank you for validating your ticket`
        }         
    },
    OrangeHRM:{        
        dashboardText: 'Dashboard',
        invalidCredentialsPattern: /invalid|credential|password/i
    },    
    SauceDemo:{      
        errors: {
            usernameRequired: 'Epic sadface: Username is required',
            passwordRequired: 'Epic sadface: Password is required',
            invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
            lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
            protectedRoute: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
            firstNameRequired: 'Error: First Name is required',
            lastNameRequired: 'Error: Last Name is required',
            postalCodeRequired: 'Error: Postal Code is required'
        }
    }
}
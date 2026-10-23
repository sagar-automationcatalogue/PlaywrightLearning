export const URLConfig = {
    UI:{
        AutomationExercise: {                            
            loginURL: '/login',
            productURL:'/products',
            cartURL: '/view_cart',
        },
        DemoWebShop: {            
            loginURL: '/login',
            wishList: '/wishlist',
            cart:'/cart',
            apparelShoes: '/apparel-shoes',
            blueGreenSneaker: '/blue-and-green-sneaker',
            books: '/books',
            registerURL: '/register',
            searchURL: '/search',
        },
        ExpandTesting: {            
            dynamicControlsURL: '/dynamic-controls',
            jsDialogsURL: '/js-dialogs',
            loginURL: '/login',
            secureURL: '/secure',
            checkboxesURL: '/checkboxes',
            dropdownURL: '/dropdown',
            dynamicPaginationURL: '/dynamic-pagination-table',
            formValidationURL: '/form-validation',
            radioButtonsURL: '/radio-buttons',
            registrationURL: '/register',
            inputsURL: '/inputs',
        },
        OrangeHRM: {            
            loginURL: '/auth/login',
            dashboardURL: '/client/#/dashboard',
            demoLoginURL: '/web/index.php/auth/login',
        },                
        SauceDemo:{            
            inventoryURL: '/inventory.html',
        }        
    },
    API:{        
        createUser: '/api/createAccount',
        AutomationExercise: {
            deleteUser: '/api/deleteAccount',
            getUserDetails: '/api/getUserDetailByEmai',
            productsList: '/api/productsList',
            updateUser: '/api/updateAccount',
        },        
        PracticeSoftwareTesting: {            
            registerUser: '/register',
            loginUser: '/login',
            currentUser: '/users/me',
            userDetails: '/users/01m3ned2h3ed0xm0ydatt48sry',
        },
    },
    
}
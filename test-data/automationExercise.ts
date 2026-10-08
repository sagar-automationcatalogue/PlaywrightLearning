export const TC_01_ValidateLogin={
    email:"sagar.automationcatalogue8@gmail.com",
    wrongPassword:"WrongPassword@123",
    password:"Admin@123",
    emptyValue:"",
    loginError:"Your email or password is incorrect!"
}

export const TC_02_AutomationExercise = {
  category:"top",
  jeanCategory:"jean",
  expectedRelatedCategory: />\s*Tops\b/i,
  pricePattern: /^Rs\.\s*\d+(\.\d{1,2})?$/
}

export const TC_03_CategoryProducts={
  brandPolo:"Polo",
  brandHM:"H&M"
}

export const TC_05_ProductReview={
    productName:'Blue Top',
    productCategory:'Category: Women > Tops',
    availability:'Availability: In Stock',
    condition:'Condition: New',
    brand:'Brand: Polo',
    currencyPrefix:'Rs.',
    defaultQuantity:'1',
    selectedQuantity:'4',
    cartConfirmation:'Your product has been added to cart.',
    emptyCartMessage:'Cart is empty!',
    reviewName:'Playwright Student',
    reviewEmail: 'playwright.review@example.com',
    reviewText: `The product details and cart quantity were easy to verify with Playwright.`,
    reviewSuccess:'Thank you for your review.'
}
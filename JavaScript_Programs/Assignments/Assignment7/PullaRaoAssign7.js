const products = [

    {
        id: 1,
        name: "Laptop",
        price: 75000,
        category: "Electronics",
        inStock: true
    },

    {
        id: 2,
        name: "Mobile",
        price: 30000,
        category: "Electronics",
        inStock: false
    },

    {
        id: 3,
        name: "Shoes",
        price: 5000,
        category: "Fashion",
        inStock: true
    },

    {
        id: 4,
        name: "Watch",
        price: 10000,
        category: "Fashion",
        inStock: true
    }

];
//Print all product name
console.log (products.at(0).name);
console.log (products.at(1).name);
console.log (products.at(2).name);
console.log (products.at(3).name);

console.log ("----------------------Printing Product Named Mobile-------------------------------------");
//Find the product named Mobile
const mobile = products.find(product => product.name === "Mobile");

console.log(mobile);
console.log ("----------------------------Prinitng all Electronics proudcts-------------------------------");
//Find all prodcuts belonging to Electronics
const electronicsprodcuts = products.filter(product => product.category == "Electronics");

console.log(electronicsprodcuts);
console.log ("---------------------Prinitng all products cost above 10,000--------------------------------------");
//Find all products whose price is greather than 10,000

const costlyproducts = products.filter(proudct => proudct.price > 10000);

console.log(costlyproducts);
console.log ("--------------------------Printing all products that are in stock---------------------------------");
// Print Products that are currnelty in stock

const instockproducts = products.filter(proudct => proudct.inStock == true);

console.log(instockproducts);

console.log ("------------------The End-----------------------------------------");



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

//1. Print all product names.
for (let i = 0; i < products.length; i++){
    let product_name =  products.at(i).name;
    console.log(product_name);
}
//2. Print products that are currently in stock.
for (let i = 0; i < products.length; i++){
    if (products.at(i).inStock == true) {
        console.log(products.at(i));
    }

}
//3. Print products whose price is greater than 10000.
for (let i = 0; i < products.length; i++){
    if (products.at(i).price > 10000){
        console.log(products.at(i));
    }

}
//4. Find the product named "Mobile".
for (let i = 0; i < products.length; i++){
    if (products.at(i).name == "Mobile"){
        console.log(products.at(i));
    }

}
//5. Calculate the total price of all products.
let total = 0;
for (let i = 0; i < products.length; i++){
    total = total + products.at(i).price;
    }
    console.log(total);

//6. Create a new array containing only product names.
let productNames = ["Laptop", "Mobile", "Shoes", "Watch"];
console.log(productNames);

//7. Find all products belonging to "Electronics".
let electronics = products.filter(product => product.category == "Electronics");
console.log(electronics);




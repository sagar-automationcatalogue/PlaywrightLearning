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

//1. Print all product names

for(let i=0;i<products.length;i++){
    let productName=products.at(i).name;
    console.log(`products are: ${productName}`);
}

//2. Print products that are currently in stock.
for(let i=0;i<products.length;i++){
    if(products.at(i).inStock){
    let productName=products.at(i).name;
    console.log(`products are in stock: ${productName}`);
    }
}

//3. Print products whose price is greater than 10000.
for(let i=0;i<products.length;i++){
    if(products.at(i).price>10000){
    let productName=products.at(i).name;
    console.log(`products that have price more than 10000: ${productName}`);
    }
}

//4. Find the product named "Mobile".
for(let i=0;i<products.length;i++){
    if(products.at(i).name=="Mobile"){
    let categoryName=products.at(i)?.category;
    console.log(`Mobile category is : ${categoryName}`);
    }
}

//5. Calculate the total price of all products.
let totalprice=0;
for(let i=0;i<products.length;i++){
    
    let price=products.at(i)?.price;
    totalprice+=price;   
}
console.log(`total price is : ${totalprice}`);

//6. Create a new array containing only product names.
let nameArr=[];
for(let i=0;i<products.length;i++){
    
    
    nameArr.push(products.at(i).name);
     
}
console.log(nameArr);
//7. Find all products belonging to "Electronics".
let categoryproducts=[];
for(let i=0;i<products.length;i++){
    if(products.at(i)?.category=="Electronics"){
    categoryproducts.push(products.at(i)?.name);
    }
}
console.log("proudcts that are under electronics category:",categoryproducts);
let number_values = [10,15,20,25,30,45,60];

let z4=number_values.filter((sagar) => sagar-20);
console.log(z4);


let cart_prices = [500,1200,300,700];
const finalAmount = cart_prices.reduce((total,price_v) =>total+price_v,0);
console.log(finalAmount)
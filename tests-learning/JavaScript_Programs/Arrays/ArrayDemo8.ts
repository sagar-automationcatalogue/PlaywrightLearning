let test_Results = ["passed","failed","skipped","passed","executed","partially executed","failed","passed"];

let flag2=test_Results.some((statusValue)=> statusValue=="partially failed");
console.log(flag2);

test_Results = ["failed","failed","passed","failed","failed","failed","failed","failed"];

let flag3=test_Results.every((statusValue)=> statusValue=="failed");
console.log(flag3);

let prices = [110,20,250,400, 350,689,540];

let prices_discount = prices.map( (price) => price*2);
console.log(prices_discount);
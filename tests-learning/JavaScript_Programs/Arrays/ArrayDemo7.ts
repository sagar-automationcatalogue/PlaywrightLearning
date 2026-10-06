let numbers = [10,20,145,50,130,99];

let z1=numbers.find((number) => number%2==1);
console.log(z1);

let z2=numbers.findIndex((number) => number%2==1);
console.log(z2);

let z3=numbers.findLast((number) => number%2==0);
console.log(z3);

let firstName = `automation`;
let lastName = `catalogue`;

//let fullName = `${firstName} ${lastName}`
//console.log(fullName);

let fullName = firstName.concat(` `,lastName,` is designed by sagar`).length;
console.log(fullName);

let message = `Order placed successfully`;
let flag1 = message.includes(`z`);
console.log(flag1);

let flag2 = message.toLowerCase().startsWith(`or`);
console.log(flag2);

flag2 = message.toUpperCase().endsWith(`ly`);
console.log(flag2);

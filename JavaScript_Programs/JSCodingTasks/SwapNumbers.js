let a = 10;
let b = 20;

console.log("Before swapping:");
console.log("a =", a);
console.log("b =", b);

a = a + b;  // a = 30
b = a - b;  // b = 10
a = a - b;  // a = 20

console.log("After swapping:");
console.log("a =", a);
console.log("b =", b);
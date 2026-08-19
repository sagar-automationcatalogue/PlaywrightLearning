let x=10, y=20;
console.log("Before Swapping:")
console.log("x value is",x);
console.log("y valie is",y);

//Using 3rd variable
/*let z =x;//z=10
x=y;//x=20
y=z;//y=10*/

//Without using 3rd variable
x=x+y;//x=30
y=x-y;//y=10
x=x-y;//x=20

console.log("After Swapping:")
console.log("x value is",x);
console.log("y valie is",y);
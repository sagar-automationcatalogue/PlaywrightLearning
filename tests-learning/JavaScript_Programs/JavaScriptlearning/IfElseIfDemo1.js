let x=90, y=75;

let z=x+y;

if(x>=80 && z<=50){
    y=4;
    let a = y*y;
    console.log("Square of a number is :",a);
}else if(x!=90 || z<=50){
    z=8;
    z=x+y;
    console.log("Addition of x,y is",z);
}else if(x==90 && y==75){
    z=y-x;
    console.log("Subtraction of x,y is ",z);
}else{
    console.log("I am learning if else if block");
}

console.log("Value of x is ",x," value of y is",y, "Value is z is ",z);

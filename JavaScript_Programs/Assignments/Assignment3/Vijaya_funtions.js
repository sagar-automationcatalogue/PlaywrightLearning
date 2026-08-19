//Create a function that accepts a name and prints a welcome message.
function message(){
    console.log("Welcome to java script funtion");
}
message();

//Create a function that accepts two numbers and returns the larger number.
function largenum(a,b){
    if(a>b){       
        return a;        
    }else{
        //console.log(b);
        return b;
    }    
}
    let num=largenum(100, 20);
    console.log("largest number is " +num);

//Create a function that calculates the square of a number.
function square(a){
    let result=a*a;
    console.log("Square of " +a, "is " +result);
}
square(2);
//Create a function that checks whether a number is even.
function even(a){
    if(a%2==0){
        console.log(a, "is even");
    }
    else{
        console.log(a, "is not even number");
    }    
}
even(6);
//Create a function that calculates an employee's annual salary.
function annualsal(monthlysal){
    let annual_sal=monthlysal*12;
    console.log("Annual salary is ", annual_sal);
}
annualsal(30000);

//Create a function that accepts product price and quantity and returns the total.
function product(prod_price, prod_quantity){
    let total=prod_price*prod_quantity;
    return total;
}
let p_total=product(200, 8);
console.log("Product toal price is ", p_total);


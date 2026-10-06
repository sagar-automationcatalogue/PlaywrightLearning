//Create a function that accepts a name and prints a welcome message.
function messagets(){
    console.log("Welcome to java script funtion");
}
messagets();

//Create a function that accepts two numbers and returns the larger number.
function largenumts(a1: number,b1: number){
    if(a1>b1){       
        return a1;        
    }else{
        //console.log(b);
        return b1;
    }    
}
    let num1=largenumts(100, 20);
    console.log("largest number is " +num1);

//Create a function that calculates the square of a number.
function squarets(a1: number){
    let result=a1*a1;
    console.log("Square of " +a1, "is " +result);
}
squarets(2);
//Create a function that checks whether a number is even.
function events(a1: number){
    if(a1%2==0){
        console.log(a1, "is even");
    }
    else{
        console.log(a1, "is not even number");
    }    
}
events(6);
//Create a function that calculates an employee's annual salary.
function annualsalts(monthlysal: number){
    let annual_sal=monthlysal*12;
    console.log("Annual salary is ", annual_sal);
}
annualsalts(30000);

//Create a function that accepts product price and quantity and returns the total.
function productts(prod_price: number, prod_quantity: number){
    let total=prod_price*prod_quantity;
    return total;
}
let p_totalts=productts(200, 8);
console.log("Product toal price is ", p_totalts);


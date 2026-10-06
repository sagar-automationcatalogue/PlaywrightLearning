//Create a function that accepts a name and prints a welcome message.

function greet(name){

    console.log("Welcome,",name);

}
greet("swetha");

//Create a function that accepts two numbers and returns the larger number.

function largest(a,b){
    if(a>b){
        console.log("Largest number is",a);
    }
    else{
        console.log("Largest number is ",b);
    }
}

largest(30,20);

//Create a function that calculates the square of a number.

function square(x){
    return x*x;
}
let value=square(10);
console.log("square of a number is :",value);

//Create a function that checks whether a number is even.

function even(num){
    if(num%2==0){
        console.log(num ,"is an even number");
    }
    else{
        console.log(num,"is not an even number")
    }
}

even(11);

//Create a function that calculates an employee's annual salary.

function anualPay(salary){
    let anualSalary=salary*12;
    return anualSalary;
}

console.log("anual salary of an employee is :",anualPay(20000));

//Create a function that accepts product price and quantity and returns the total.

function totalCost(qty,price){
   let total=qty*price;

   return total;
}

console.log("total cost of the products is,",totalCost(15,2));
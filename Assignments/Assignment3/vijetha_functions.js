//Create a function that accepts a name and prints a welcome message.

function myname(a) {
    console.log("Welcome to my Assignmnet3", a)
}

myname(vijetha);

//Create a function that accepts two numbers and returns the larger number.

function largerNumber(a, b) {
    if (a > b) {
        return a;
    }else {
        return b;
    }           
}
console.log(largerNumber(10, 20));

//Create a function that calculates the square of a number.

function square(a) {
    return a * a;
}
console.log(square(5));

//Create a function that checks whether a number is even.

function evenNumber(a) {
    if (a % 2 === 0) {
        return true;
    } else {
        return false;
    }
}
console.log(evenNumber(5)); 
console.log(evenNumber(6)); 

//Create a function that calculates an employee's annual salary.

function annualSalary(salary) {
    return salary * 12;
}
console.log(annualSalary(5000));


//Create a function that accepts product price and quantity and returns the total.

function calculateTotal(price, quantity) {
    return price * quantity;
}
console.log(calculateTotal(10, 5)); 


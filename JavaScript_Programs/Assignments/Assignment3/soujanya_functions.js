//1. Function to print welcome message
function greetMessage(name){
    console.log('Welcome to Java Script learning!', name);
}
greetMessage("soujanya");

//2.Function to find larger number
function largeNumber(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}
console.log(largeNumber(10, 20));

//3.Function to calculate square
function calculateSquare(num){
    return num * num;
}
console.log(calculateSquare(4)); 

//4. Function to check even number
function isEven(num) {
    if (num % 2 == 0) {
        return true;
    } else {
        return false;
    }
}
console.log(isEven(10)); 

//5. Function to calculate annual salary
function annualSalary(salary) {
    return salary * 12;
}
console.log(annualSalary(300)); 

//6. Function to calculate total price
function priceQuantity(price, quantity) {
    total = price * quantity;
    return total;
}
console.log(priceQuantity(20, 3)); 
// function to printwelcome message
function welcome(name){
    console.log(`welcome ${name}`);
}

//function which accepts two numbers and return larger number
function largenumber(num1,num2){
    return Math.max(num1,num2);
}

//function to calculate square of a number
function calSquare(num){
    return num*num;
}

//function which checks whethera number is even or not
function iseven(num){
    return num%2==0;
}

//function to calculate annual salary
function annualSalary(monthlySalary){
    return monthlySalary*12;
}

//function to calculate product of price and quantity
function totalCost(price, quantity){
    return price*quantity;
}

welcome("message"); //welcome message
console.log("large number (5 vs 7):",largenumber(5,7)); //large number (5 vs 7):7
console.log("Square of 5 is:",calSquare(5)); //Square of 5 is:25
console.log("Is even 6 is:",iseven(6)); //Is even 6 is:true
console.log("Is even 9 is:",iseven(9)); //Is even 9 is:false
console.log("Annual salary ($250/month) is:$",annualSalary(250)); //Annual salary($250/month) is:$3000
console.log("total cost ($10.12*2) is:$",totalCost(10.12,2)); //total cost($10.12*2) is:$20.24

// function to printwelcome message
function welcome1(name: string){
    console.log(`welcome1 ${name}`);
}

//function which accepts two numbers and return larger number
function largenumber1(num1:number,num2:number){
    return Math.max(num1,num2);
}

//function to calculate square of a number
function calSquare1(num:number){
    return num*num;
}

//function which checks whethera number is even or not
function iseven1(num:number){
    return num%2==0;
}

//function to calculate annual salary
function annualSalary1(monthlySalary:number){
    return monthlySalary*12;
}

//function to calculate product of price and quantity
function totalCost1(price:number, quantity:number){
    return price*quantity;
}

welcome1("message"); //welcome message
console.log("large number (5 vs 7):",largenumber1(5,7)); //large number (5 vs 7):7
console.log("Square of 5 is:",calSquare1(5)); //Square of 5 is:25
console.log("Is even 6 is:",iseven1(6)); //Is even 6 is:true
console.log("Is even 9 is:",iseven1(9)); //Is even 9 is:false
console.log("Annual salary ($250/month) is:$",annualSalary1(250)); //Annual salary($250/month) is:$3000
console.log("total cost ($10.12*2) is:$",totalCost1(10.12,2)); //total cost($10.12*2) is:$20.24

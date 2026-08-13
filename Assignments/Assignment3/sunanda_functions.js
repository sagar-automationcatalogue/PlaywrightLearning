// function for Welcome message with name
function displayname(){

    console.log('Welcome Sunanda !!');
}

// function for Display larger number
function largenumber(a,b){

    if(a>b)
    {
        console.log(a, 'is the larger number ',);
    }
    else
    {
        console.log(b, 'is larger number',);
    }
}
//function for square of a number
function squareofanumber(x){

    result = x*x;
    console.log('square of a number is ', result)
}
//function for even or odd
function evenorodd(y){

    if(y%2==0)
    {
        console.log(y,'is even number');
    }
    else
    {
        console.log(y, 'is odd number');
    }
}
//function for Employee annual salary
function annualsalary(salary){

    Annual_Salary=salary*12;
    console.log('Annual Salary of an employee is ', Annual_Salary);
}
// function for price of a product
function priceofproduct(price,quantity){

    Total_price=price*quantity;
    console.log('Total price of a product is' ,Total_price);
}
displayname();
largenumber(10,20);
squareofanumber(9);
evenorodd(4);
annualsalary(10000);
priceofproduct(300,6);
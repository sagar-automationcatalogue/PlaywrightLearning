/*function welcomeUser(name){

console.log("Welcome, "+ name + "!");


}
welcomeUser("surekha");*/

/*function findLarger(num1,num2)
{
    if(num1> num2)
    {
        return num1;

    }else {
        return num2;
    }
}

console.log(findLarger(10,20));*/


/** ***SquareNumber****** */

/*function squareNumber(num){
    return num*num;
}
console.log(squareNumber(7));*/

/**** checkEvenOdd****/ 
/*function checkEvenOdd(num) {
    if (num %2 ==0) {
        return "even";
    }else {
        return "Odd";
    }
}
console.log(checkEvenOdd(3));
console.log(checkEvenOdd(2));*/



/*** Employee annual salary**/


function calculationAnualSalary(Standard_hours, Standard_per_week){

   const weeks_per_year =52;
    return Standard_hours * Standard_per_week * weeks_per_year;
}

console.log(calculationAnualSalary(8,40)); 
/*** output 16640 */
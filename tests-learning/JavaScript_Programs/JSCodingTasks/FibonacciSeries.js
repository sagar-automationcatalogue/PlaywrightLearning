//first 10 numbers of fibonacci series
//0,1,1,2,3,5,8,13,21

let maxCount=100;
let firstNumber =0;
let secondNumber=1;
console.log(firstNumber);
console.log(secondNumber);

/*for(let count=2;count<100;count++){
    let newNumber = firstNumber+secondNumber;
    console.log(newNumber);

    firstNumber=secondNumber;
    secondNumber=newNumber;
}*/

while(true){
    let newNumber = firstNumber+secondNumber;    
    if(newNumber>100){
        break;
    }
    console.log(newNumber);
    firstNumber=secondNumber;
    secondNumber=newNumber;
}
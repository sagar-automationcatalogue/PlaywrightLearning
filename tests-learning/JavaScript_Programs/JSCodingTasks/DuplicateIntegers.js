let numbers=[10,20,40,20,10,90,50,40,20];
let countOfNumbers={};

//duplicate numbers
for(let i=0;i<numbers.length;i++){
    let number = numbers.at(i);
    if(countOfNumbers[number]===undefined){
        countOfNumbers[number]=1;
    }else{
        let count=countOfNumbers[number];
        countOfNumbers[number]=count+1;
    }
}
//print
for(let number in countOfNumbers){
    if(countOfNumbers[number]>1){
        console.log(number);
    }
}



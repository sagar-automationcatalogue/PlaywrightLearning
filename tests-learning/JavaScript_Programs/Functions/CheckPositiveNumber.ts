function checkNumber(n: number):string{
    if(n>0){
        return "positive";
    }else if (n<0){
        return "negative";
    }else{
        return "Neither positive nor negative number and it's zero";
    }
    console.log("This is end of the function");
}

let result:string = checkNumber(99);
console.log(result);

console.log(checkNumber(-50));

console.log(checkNumber(0));


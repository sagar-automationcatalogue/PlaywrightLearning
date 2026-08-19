let data = (n:number):number => {   
    let sum:number=0;
    while(n!=0){
        let r:number= n%10;
        sum = r+sum*10;
        n=Math.floor(n/10);
    }
    return sum;    
}

let num1 = 141;
let reverse:number= data(num1)
console.log(reverse);

if(reverse == num1){
    console.log(`Given number is palindrome number :`,num1);
}else{
    console.log(`Given number is not palindrome number :`,num1);
}





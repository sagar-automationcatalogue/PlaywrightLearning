const numbers = [-5,10,-2,20,15,-8];
let sum=0;

for (let i=0; i<= numbers.length-1; i++){
  if (numbers[i] > 0){
    sum=sum+numbers[i]*2;
  }
}

console.log("Total is:",sum);
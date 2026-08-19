const numbers = [-5, 10, -2, 20, 15, -8];

let total_sum=0;
for(let i=0;i<numbers.length;i++){

    if(numbers[i]>0){
        total_sum=total_sum+numbers[i]*2;
    }
}

console.log(total_sum);
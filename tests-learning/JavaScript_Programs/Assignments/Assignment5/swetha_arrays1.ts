let a:number[]=[10,13,3,15,17,9];

let min=Number.MAX_SAFE_INTEGER;
let max=Number.MIN_SAFE_INTEGER;

for(let i=0;i<a.length;i++){
    if(a[i]>max){
        max=a[i];
    }
    else if(a[i]<min){
        min=a[i];
    }
}

console.log("Maximum number is:",max);
console.log("Minimum number is:",min);
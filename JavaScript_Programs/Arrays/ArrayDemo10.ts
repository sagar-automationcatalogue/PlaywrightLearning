let values =[1,2,3,4,5,6];

let z5=values.filter((n)=>n%2==0).map((n)=>n*3).reduce((t,n)=>t+n,0);
console.log(z5);

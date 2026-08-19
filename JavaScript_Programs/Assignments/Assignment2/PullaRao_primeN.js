let n=7, i=1, count=0;
while(i<=n){
    if(n%i==0){
        count++;
    }i++;
}
if(count==2){
    console.log(n," is prime number");
}
else{
    console.log(n," is non prime number");
}
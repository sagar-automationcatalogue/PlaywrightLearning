let n=4,i=1;
let count=0;

while(i<=n){
    if(n%i==0){
        count++;
    }
    ++i;

}
if(count==2){
    console.log(n,"is prime number")
}
else{
    console.log(n,"not a prime number");
}

let count=0, i=1, n=7;
while(i<=n){
        if(n%i==0){
            count++;
        }
        i++;
    }
        if(count==2){
            console.log(n, "is a prime number");
        }else{
            console.log(n, "is not the prime number");
        }
    


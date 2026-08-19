let n=7, i=1;count =0;

while(i<=n)
{
    
    if(n%i==0)
    {
        count++;
    }
    i++;

}

if(count == 2)
{
    console.log(n, " is a prime number");
}
else
{
    console.log(n, "It is not a prime number");
}
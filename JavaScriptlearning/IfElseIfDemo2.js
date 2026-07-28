let x=99;
if(x<=80){
    x+=100;
}else if(x%2==0){
    x=x-10;
}else if(x>=50){
    x-=90;//x=x-90
}else if(x<=0){
    x=x*x;
}else{
    x++;
}
console.log("Value of x is :",x);
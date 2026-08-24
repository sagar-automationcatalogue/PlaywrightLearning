let evenSum=0, oddSum=0;

let flag = false;

for(let i=1;i<=10;++i){
	if(i%2==0){
		evenSum =evenSum+i;
	}else{
        oddSum=oddSum+i;
    }
}

if(flag){
    console.log("Sum of all 10 even numbers is",evenSum);
}else{
    console.log("Sum of all 10 odd numbers is",oddSum);
}

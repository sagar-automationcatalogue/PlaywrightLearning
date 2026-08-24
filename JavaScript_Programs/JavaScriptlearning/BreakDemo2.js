testing: for(let i=1;i<=5;i++){
    for(let j=1;j<=5;j++){
        if(j==2){
            break testing;
        }
        console.log(j);
    }
    break
}
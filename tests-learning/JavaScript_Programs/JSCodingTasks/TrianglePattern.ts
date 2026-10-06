let tr=(rows:number):void => {
    for(let i=rows;i>=1;i--){
        let pattern = "";
        for(let j=1;j<=i;j++){
            pattern = pattern+j+" ";
        }
        console.log(pattern);
    }
}
tr(7);
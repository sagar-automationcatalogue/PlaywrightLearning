let str = `automation programming`;

let countOfChars={};

//unique characters
for(let i=0;i<str.length;i++){
    let ch = str.charAt(i);
    if(countOfChars[ch]===undefined){
        countOfChars[ch]=1;
    }else{
        let count=countOfChars[ch];
        countOfChars[ch]=count+1;
    }
}
//prpinting unique characters
for(let abcd in countOfChars){
    if(countOfChars[abcd]==1){
        console.log(abcd);
    }
}



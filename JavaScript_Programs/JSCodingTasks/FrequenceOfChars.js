let str = `automation programming`;

let countOfChars={};

//frequence characters
for(let i=0;i<str.length;i++){
    let ch = str.charAt(i);
    if(countOfChars[ch]===undefined){
        countOfChars[ch]=1;
    }else{
        let count=countOfChars[ch];
        countOfChars[ch]=count+1;
    }
}

for(let ch in countOfChars){
    console.log(`${ch} is repeated :${countOfChars[ch]}`);
}



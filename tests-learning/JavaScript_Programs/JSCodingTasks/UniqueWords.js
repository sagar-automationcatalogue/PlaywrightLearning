let str = `JavaScript automation and JavaScript teaching automation`;
let words = str.split(" ");
console.log(words)

let countOfWords={};

//Unique Words
for(let i=0;i<words.length;i++){
    let word = words.at(i);
    if(countOfWords[word]===undefined){
        countOfWords[word]=1;
    }else{
        let count=countOfWords[word];
        countOfWords[word]=count+1;
    }
}

for(let word in countOfWords){
    if(countOfWords[word]==1){
        console.log(word);
    }
}



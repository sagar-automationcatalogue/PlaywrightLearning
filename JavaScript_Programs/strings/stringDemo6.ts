let sentence = `JavaScript is very easy and TypeScript is an enhancement of JavaScript+Type Saftey`;
console.log(sentence.trim());

let words = sentence.split(" ")
console.log(words);

words = sentence.split("and");
console.log(words);


for(let a=0;a<words.length;a++){
    console.log(words.at(a)?.trim().toUpperCase().length);
}


let symbol = "abcd";
let result = symbol.repeat(500)
console.log(result);

let bankAccountNumber = "463274628343";
result = bankAccountNumber.padStart(16,"0");
console.log(result);

result = bankAccountNumber.padEnd(16,"-");
console.log(result);
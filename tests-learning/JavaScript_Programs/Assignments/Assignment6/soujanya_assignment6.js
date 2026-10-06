//1. Reverse of every word
let string = `JavaScript learning is easy`;
let words = string.split(` `);

console.log(words);

let reverseString = ``;

for (let i = 0; i < words.length; i++){
    let reverseWord = words[i].split(``).reverse().join(``);
    reverseString = reverseString + ` ` + reverseWord;
}

console.log(reverseString);

//2. Reverse of the words
let reverseString1 = ``;

for (let i = words.length-1; i >= 0; i--){
    reverseString1 = reverseString1 + ` ` + words[i]; 
}
console.log(reverseString1);

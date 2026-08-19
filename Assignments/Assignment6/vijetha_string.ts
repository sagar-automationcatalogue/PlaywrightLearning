//Reverse of every word 
function reverseEveryWord(sentence: string): string {
    let words = sentence.split(" ");
    let result = "";

    for (let i = 0; i < words.length; i++) {
        let reversedWord = "";

        for (let j = words[i].length - 1; j >= 0; j--) {
            reversedWord += words[i][j];
        }

        result += reversedWord;

        if (i < words.length - 1) {
            result += " ";
        }
    }

    return result;
}

console.log(reverseEveryWord("I like Automation")); 



// Reverse of the words

let str = "Hello This is vijetha";
let words = str.split(" ");
for (let i = 0; i < words.length; i++) {
  words[i] = words[i].split("").reverse().join("");
}
console.log(words.join(" "));
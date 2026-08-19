/* Reverse of the words */
let str1 = "JavaScript learning is easy"
let word = str1.split(" ");

let reverseofword = ``;

for(let i=word.length-1;i>=0;i--)
{
    reverseofword = reverseofword+word.at(i)+ " ";
}
console.log(reverseofword);

/* Reverse of every word */

let word1 = word[3] + " " +word[2] + " " +word[1]+ " "+word[0];

let reverseofword1 = " ";

for(let k=word1.length-1;k>=0;k--)
{
    reverseofword1=reverseofword1+word1.at(k);
}
console.log(reverseofword1);
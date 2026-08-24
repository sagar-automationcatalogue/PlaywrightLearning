let str1=`JavaScript learning is easy`;
let words1:string[]=str1.split(" ");
let reverse1=``;
for(let index=0;index<words1.length;index++)
{
    let words2=words1[index];
    for(let j=words2.length-1;j>=0;j--)
    {
        reverse1=reverse1+words2[j];
        

    }
    reverse1=reverse1+" ";
    
}

console.log(`reverse of the string is  ${reverse1}`);
//Reverse of the words
console.log(`Reverse of the words`);
console.log(str1);
//console.log(words1);
//let wordss
let reverse2=``;
for(let index=words1.length-1;index>=0;index--)
{
    reverse2+=words1[index]+"  ";
    

}
console.log(reverse2);
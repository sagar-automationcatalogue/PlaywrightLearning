//1. Reverse of every word
let str=`JavaScript learning is easy`;
let reverse=``;
let words:string[]=str.split(" ");
for(let i=0;i<words.length;i++){
    let word=words[i];
    
    for(let j=word.length-1;j>=0;j--){
        reverse=reverse+word[j];
    }
    reverse+=" ";

}
console.log(reverse);

//2. Reverse of the words\
let reversed_line=``;
let arr:string[]=str.split(" ");
for(let i=arr.length-1;i>=0;i--){
    reversed_line+=arr[i]+" ";
    
}
console.log(reversed_line);







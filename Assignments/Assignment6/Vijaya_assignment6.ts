//Reverse of every word
function reverseEachWord(sentence: string): string {
  const str= sentence.split(" ");
  let result=[];

  for (let i = 0; i < str.length; i++) {
    let reversedWord: string = "";
    for (let j = str[i].length - 1; j >= 0; j--) {
      reversedWord += str[i][j];
    }
    result.push(reversedWord);
  }
  return result.join(" ");
}
const input: string = "JavaScript learning is easy";
console.log(reverseEachWord(input));

//Reverse of the words

function reversesentence(sentence: string): string {
  const str= sentence.split(" ");
  let result:string ="";

  for(let i=str.length-1; i>=0; i--){
    result+=str[i];
    if(i!=0){
        result+=" ";
    }
  }
  return result;
    }
const input1: string = "JavaScript learning is easy";
console.log(reversesentence(input1));
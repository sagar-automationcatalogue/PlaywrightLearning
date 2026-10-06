let str1=`JavaScript learning is easy`;
let str2="";

// split the string into an array of words
let str3=str1.split(" ");

//loop through each word
for (let str4 of str3){
    let str5="";
    // reverse the current word character by character
    for (let i=str4.length-1; i>=0;i--){
        let c=str4.charAt(i);
        str5=str5+c;
    }
    str2=str2+str5+" ";
}
console.log(str2.trim()); // Output:tpircSavaJ gninrael si ysae
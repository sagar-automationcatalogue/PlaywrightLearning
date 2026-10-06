//Reverse of a String using tradional for loop
let str = "JavaScript Learning";
//o/p: gninreaL tpircSavaJ
let reversed = ``;
for(let i = str.length-1;i>=0;i--){
    reversed = reversed+str.at(i);
}
console.log(reversed);

//Reverse of a String using in-built functions
/*let str2 = str.split("");
console.log(str2);
str2.reverse();
console.log(str2);
let str3 =  str2.join("");
console.log(str3);*/

let str4 = str.split("").reverse().join("");
console.log(str4);
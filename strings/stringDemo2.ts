let x= "automation";//string primitive
console.log(x);
console.log(typeof x);

let y = new String("automation");//string object
console.log(y);
console.log(typeof y);

let z = "automation";
if(x===z){
    console.log(`Both the strings are same`);
}else{
    console.log(`Both the strings are not same`);
}

console.log(x[0]);//a
console.log(x[1]);//u
console.log(x[2]);//t
console.log(`Length of the string is ${x.length}`);
console.log(`Last charcater of a string is ${x[x.length-1]}`)

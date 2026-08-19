let str5 = "playwright automation testing automation";
let value = str5.indexOf(`automation`);
console.log(value);


let value1 = str5.lastIndexOf(`automation`);
console.log(value1);


let str6 = str5.slice(3,13);
console.log(str6);

let str7 = str5.substring(2,12);
console.log(str7);

str6 = str5.slice(-20);
console.log(str6);

str7 = str5.substring(-20);
console.log(str7);


str7=str5.replaceAll(`automation`,`coding`);
console.log(str7);



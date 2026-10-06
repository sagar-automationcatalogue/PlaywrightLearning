let tools = ["playwright","selenium","cypress","tosca","webdriver io","katalon"];
console.log(tools[2]);

tools[2]="java";
console.log(tools);

console.log(tools[tools.length-1]);

console.log(tools.at(-1));
console.log(tools.at(-2));
console.log(tools.at(-6));
console.log(tools.at(2));

let x= tools.push("UFT");
console.log(tools);
console.log("length of the array ",x);

x= tools.push("groovy","devops","abcd");
console.log(tools);
console.log("New length of the array ",x);

x=tools.unshift("automation");
console.log(tools);
console.log("New length of the array ",x);

let y=tools.pop();
console.log(tools);
console.log(y);

y = tools.shift();
console.log(tools);
console.log(y);
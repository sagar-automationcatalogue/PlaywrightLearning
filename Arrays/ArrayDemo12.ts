let technologies = ["javascript","typescript", "java","python"];
console.log(typeof technologies);

let reuslt = technologies.join("-");
console.log(reuslt);
console.log(typeof reuslt);

let tools = ["playwright","selenium","cypress"];
let result2= technologies.concat(tools);
console.log(result2);

let result3= tools.concat(technologies);
console.log(result3);

let result4 = ["javaScript",...tools, ...technologies, "automation","testing"];
console.log(result4);




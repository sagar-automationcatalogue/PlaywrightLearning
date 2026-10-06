let testing_tools_data = ["playwright","selenium","webdriver io","cypress","uft","katalon","tosca"];
console.log(testing_tools_data.length);

let latest_testing_tools = testing_tools_data.slice(0,testing_tools_data.length/2);
//let latest_testing_tools = testing_tools_data.slice(0,3);
console.log(latest_testing_tools);
console.log(testing_tools_data);

//remove
testing_tools_data.splice(1,3);
console.log(testing_tools_data);

//insert
testing_tools_data.splice(2,0,"JavaScript","typescript","C#");
console.log(testing_tools_data);

//replace
testing_tools_data.splice(1,1,"automation testing","java");
console.log(testing_tools_data);
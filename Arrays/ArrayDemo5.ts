let testing_tools = ["playwright","selenium","cypress","tosca","webdriver io","katalon"];

/*
//traditional way of loooping over the way
for(let i=0;i<=testing_tools.length-1;i=i+2){
    console.log(testing_tools.at(i));
}

//by using for ... of
for(let sagar of testing_tools){
    console.log(sagar);
}*/

//by using forEach()
testing_tools.forEach((tool)=> {
      console.log("Tool Name is :",tool);
    }
)

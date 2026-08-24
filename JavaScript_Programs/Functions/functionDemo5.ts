function displayMessage():string{
    console.log("Before return!!!")
    return "completed";    
    console.log("After return!!!")
}

let str = displayMessage();
console.log(str);
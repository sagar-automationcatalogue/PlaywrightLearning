function outer(){
    const message ="Hello";

    function inner(){
        console.log(message);
    }

    inner();
}

outer();
////////////////////////////////////////////////

function createCounter(){
    let count=0;

    function increment(){    
        count++;
        console.log("Count is increased to ",count);
    }    

    function getCountData(){
        return count;
    }
    return {increment, getCountData};    
}

let x=createCounter();
x.increment();
x.increment();
x.increment();
x.increment();

console.log("Final Count value is :",x.getCountData());


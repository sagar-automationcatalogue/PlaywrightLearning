function calculate(a,b,operation){
    const result = operation(a,b);
    console.log("Result is :",result);
}

function add(n1, n2){
    return n1+n2;
}

function subtract(n1, n2){
    return n1-n2;
}

function multiply(n1,n2){
    return n1*n2;
}

calculate(10,20,add);
calculate(10,20,subtract);
calculate(10,20,multiply);
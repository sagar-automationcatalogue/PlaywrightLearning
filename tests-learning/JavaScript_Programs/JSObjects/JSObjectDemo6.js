const employee_data={
    name:`Pulla rao`,
    age: 35,
    country:`India`,

    add(a,b){
       return a+b; 
    }
}

/*for(let key in employee_data){
    console.log(employee_data[key]);
}*/

let result1=Object.keys(employee_data);
console.log(result1);

let result2= Object.values(employee_data);
console.log(result2);

let result3 = Object.entries(employee_data);
console.log(result3);


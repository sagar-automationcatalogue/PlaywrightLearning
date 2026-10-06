const employees =[
    {
        employee_id:101,
        employee_name:`Vijetha`,
        employee_country:`Canada`
    },
    {
        employee_id:102,
        employee_name:`Sneha`,
        employee_country:`USA`
    },
    {
        employee_id:103,
        employee_name:`Sandeep`,
        employee_country:`India`,
        employee_state:`Andhra`
    },
    {
        employee_id:104,
        employee_name:`Brahmam`,
        employee_country:`Canada`
    },
    {
        employee_id:105,
        employee_name:`Kamesh`,
        employee_country:`USA`
    },
    {
        employee_id:105,
        employee_name:`Manikanta`,
        employee_country:`India`
    }
]
console.log(employees);
console.log(employees.at(1).employee_id);
console.log(employees.at(1).employee_name);
console.log(employees.at(1).employee_country);

for(let i=0;i<employees.length;i++){
    //let emp_name = employees.at(i).employee_name;
    //console.log(emp_name);
    if(i==2){
        for(let key in employees.at(i)){
            console.log(employees.at(i)[key]);
        }
    }
}

/*for(let emp of employees){
    console.log(emp);
}*/
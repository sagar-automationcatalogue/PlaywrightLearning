class Employee_Org{
    name;
    static salary=88000;

    constructor(n:string){
        this.name=n;
    }


    displayDetails():void{
        console.log(`name of the employee is ${this.name}`);
        console.log(`salary of the employee is ${Employee_Org.salary}`);
    }
}

let e1 = new Employee_Org(`Pratyusha`);
let e2 = new Employee_Org(`Brahmamm`);
let e3 = new Employee_Org(`Vijetha`);

Employee_Org.salary=Employee_Org.salary+10000;

e3.displayDetails();
e2.displayDetails();



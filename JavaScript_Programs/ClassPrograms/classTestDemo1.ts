//Class
class Employee{
    name=`Sagar`;
    age=30;
    designation=`Test Engineer`;

    constructor(){//Default constructor
        console.log(`I am inside the constructor`);
        let a=10, b=20;
        let c=a+b;
        console.log(`addition of a,b is :${c}`);
    }

    //method
    displayDetails(){
        console.log(`name of the employee is ${this.name}`);
        console.log(`age of the employee is ${this.age}`);
        console.log(`designation of the employee is ${this.designation}`);
    }
}

let ob1 = new Employee();
console.log(ob1.name);

let ob2 = new Employee();
console.log(ob2.name);

let ob3 = new Employee();
console.log(ob3.designation);
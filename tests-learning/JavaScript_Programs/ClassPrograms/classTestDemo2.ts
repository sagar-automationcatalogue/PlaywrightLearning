//Class
class Employee_Data{
    name;
    age;
    designation;

    constructor(n:string, a:number, d:string){//parameterized constructor
       this.name =n;
       this.age =a;
       this.designation=d;
    };

    //method
    displayDetails():void{
        console.log(`name of the employee is ${this.name}`);
        console.log(`age of the employee is ${this.age}`);
        console.log(`designation of the employee is ${this.designation}`);
    }
}

let emp1 = new Employee_Data(`Brahmam`,31,`Test Engineer`);
let emp2 = new Employee_Data(`Manikanta`,32,`Developer`);
let emp3 = new Employee_Data(`Prayusha`,30,`Business Analyst`);

console.log(emp1.name);
console.log(emp2.name);
console.log(emp3.name);

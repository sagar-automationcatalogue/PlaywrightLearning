class Employee_Info{
    //instance properties
    name;
    age;
    designation;

    constructor(n:string,a:number,d:string){
        this.name=n;
        this.age=a;
        this.designation=d;
    }
}

let ob = new Employee_Info(`kamesh`,35, 'Tester');
console.log(Employee_Info.name);


class Employee_Info1{
    //static properties
    static name=`Pulla Rao`;
    static age=40;
    static designation=`Manager`;

    static displayDetails(){
        console.log(`I am inside the static method of Employee_Info1`);
    }
}

Employee_Info1.displayDetails();
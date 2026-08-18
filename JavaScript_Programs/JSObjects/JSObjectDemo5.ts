let student_Info={
    name:`Pratyusha`,
    age:25,

    display(){
        console.log(`I am in the display method of a student_data`)
        console.log(this.name);
        console.log(this.age);
    },

    add(a:number,b:number):void{
        let c:number=a+b;
        console.log(`Addition of ${a},${b} is ${c}`);
    },

    cube(a:number):any{
        let result = a*a*a;
        return result;
    }
};

console.log(student_Info);
console.log(student_Info.name);
console.log(student_Info.age);
student_Info.display();
student_Info.add(10,20);

let z1:number=student_Info.cube(5);
console.log(z1);

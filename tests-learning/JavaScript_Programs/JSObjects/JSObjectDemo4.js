let student_data={
    name:`Pratyusha`,
    age:25,

    display(){
        console.log(`I am in the display method of a student_data`)
        console.log(this.name);
        console.log(this.age);
    },

    add(a,b){
        let c=a+b;
        console.log(`Addition of ${a},${b} is ${c}`);
    },

    cube(a){
        let result = a*a*a;
        return result;
    }
};

console.log(student_data);
console.log(student_data.name);
console.log(student_data.age);
student_data.display();
student_data.add(10,20);

let z=student_data.cube(5);
console.log(z);

class Calculator{   

    add(a:number, b:number){
        let result = a+b;
        return result;
    }

    cube(a:number, b:number):number{
        let c = this.add(a,b);
        let cube = c * c * c;
        return cube;
    }
}

/*let C1 = new Calculator();
let z=C1.cube(10,5);
console.log(z);*/

console.log(new Calculator().cube(2,4));



let x1=20;
interface Person{
    name:string;
    age?:number;
    country?:string;
    address?:any
}

let person_data:Person={
    name:`Brahmam`,
    age:28,     
}

console.log(person_data);
console.log(person_data.name);

//New element is added
person_data.country=`India`;
console.log(person_data);

person_data.address=["near tankbund","hyderabad",500090];
console.log(person_data);

//Modifying the existing city
person_data.country=`USA`;
console.log(person_data);


//delete the existing city
delete person_data.age;
console.log(person_data);

person_data={
    name:`Sunanda`,
    country:`Canada`    
};
console.log(person_data);
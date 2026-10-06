let x=20;

const person={
    name:`Brahmam`,
    age:28,
    city:`Hyderabad`,
    course: `Playwright`,
    isPermanent: true,
    identityTypes: ["aadhar","pan","driving licence"]
}

console.log(person);
console.log(person.name);
console.log(person.city);
console.log(person.identityTypes);
console.log(person.identityTypes.length);

console.log(person["isPermanent"]);

//New element is added
person.country=`India`;
console.log(person);

person.address=["near tankbund","hyderabad",500090];
console.log(person);

//Modifying the existing city
person.city=`Bangalore`;
console.log(person);


//delete the existing city
delete person.isPermanent;
console.log(person);

person={
    language:`Telugu`,
    data:`automation`
};
console.log(person);
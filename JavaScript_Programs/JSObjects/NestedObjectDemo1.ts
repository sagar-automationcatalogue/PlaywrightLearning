const employee_info = {
    name:`Soujanya`,
    age:29,

    address:{
        city:`Hyderabad`,
        state:`Telangana`,
        country:`India`,
        pincode: 500090,        
    },

    skills: [`playwright`,`selenium`,`cypress`,`appium`],
    
    getCompleteAddress(){
        console.log(`Name is ${employee_info.name} and Age is ${employee_info.age} City is ${this.address.city} and 
            state ${this.address.state} and country ${this.address.country} and pincode is ${this.address.pincode}`)
    }
}

console.log(employee_info);
console.log(employee_info.name);
console.log(employee_info.address.country);

employee_info.address.country=`USA`;
console.log(employee_info);

employee_info.getCompleteAddress();
console.log(`My total number of skills are ${employee_info.skills.length}`)
console.log(`My First skill is are ${employee_info.skills.at(0)}`)
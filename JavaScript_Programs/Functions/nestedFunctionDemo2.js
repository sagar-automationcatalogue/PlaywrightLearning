
//global variable
let instituteName = "Automation Catalogue";

//outer function
function studentDetails(){
    let studentName = "Manikanta";

    //inner function
    function displayDetails(){
        let courseName = "Playwright Automation";

        console.log("Institute Name is:",instituteName);
        console.log("Student Name is: ",studentName);
        console.log("Course Name is:",courseName);
    }

    console.log("Student Name is: ",studentName);

    displayDetails();
}

console.log("Student Name is: ",studentName);


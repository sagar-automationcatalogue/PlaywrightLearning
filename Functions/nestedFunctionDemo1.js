//outer function
function displayStudentDetails(){
    console.log("Student Name : Sneha");

    //inner function
    function displayCourse(){
        console.log("Course: Playwright Automation");
    }

    displayCourse();
}

displayStudentDetails();


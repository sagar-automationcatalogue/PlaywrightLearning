function evenSum(...numbers:number[]):number{

    let sum = 0;

    for (let i = 0; i < numbers.length; i++) {

        if (numbers[i] % 2 == 0) {
            sum = sum + numbers[i];
        }
    }

    return sum;
}
let total=evenSum(1, 2, 3, 4, 5, 6);

console.log("total sum of even numbers is:",total);






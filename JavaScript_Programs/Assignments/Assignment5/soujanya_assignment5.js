//  find the minimum and maximum number of an array
let numbers = [5, 12, 3, 20, 8];

let min = numbers[0];
let max = numbers[0];

for (let i = 0; i < numbers.length; i++){
    if (numbers[i] < min){
        min = numbers[i];
    }
    if (numbers[i] > max){
        max = numbers[i];
    }
}

console.log("Minimum:", min);
console.log("Maximum:", max);

//Calculate the sum of positive doubled values
const numbers2 = [-5, 10, -2, 20, 15, -8];

let total = 0;

for (let i = 0; i < numbers2.length; i++){
    if (numbers2[i] > 0) {
        total = total + numbers2[i] * 2;
    }
}
console.log("Total:", total);

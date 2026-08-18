//Take an array with few random numbers and find the minimum and maximum number of an array
let num = [45,92,10,50,23,9,88,55];

let min = num[0];
let max = num[0];

for (let i = 1; i < num.length; i++) {
  if (num[i] < min) {
    min = num[i];
  }
  if (num[i] > max) {
    max = num[i];
  }
}

console.log("Minimum:", min); 
console.log("Maximum:", max);

//Calculate the sum of positive doubled values

const num1 = [-5, 10, -2, 20, 15, -8, 77];

let total = 0;

for (let i = 0; i < num1.length; i++) {
  if (num1[i] > 0) {
    total += num1[i] * 2;
  }
}

console.log("Total:", total); 
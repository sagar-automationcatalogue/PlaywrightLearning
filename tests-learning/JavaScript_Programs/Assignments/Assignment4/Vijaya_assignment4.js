function sumOfEvens(...x) {
  let sum = 0;

  for (let i = 0; i < x.length; i++) {
    if (x[i] % 2 === 0) {
      sum += x[i];
    }
  }

  return sum;
}
const result = sumOfEvens(1,2,3,4,5,6,7,8,9,10);

console.log(result); 
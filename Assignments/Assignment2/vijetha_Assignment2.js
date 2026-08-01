let n = 12;
let count = 0;
let i = 1;

while (i <= n) {
    if (n % i == 0) {
        count++;
    }
    i++;
}
if (count == 2) {
    console.log(n + " is a prime number");
} else {
    console.log(n + " is not a prime number");
}
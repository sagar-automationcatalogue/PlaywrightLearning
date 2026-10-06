let n = 9;
let count = 0;
let i = 1;

while (i <= n) {
    if (n % i === 0) {
        count++;
    }
    i++;
}

if (count == 2) {
    console.log("prime number");
} else {
    console.log("not a prime number");
}

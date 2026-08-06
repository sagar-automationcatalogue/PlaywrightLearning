function sumOfEvens(...numbers) {
    let sum = 0;
    for (const num of numbers) {
        if (num % 2 == 0) {
            sum += num;
        }
    }
    return sum;
}

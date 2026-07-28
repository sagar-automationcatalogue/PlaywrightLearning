let x=25, y=26, a=90, b=91;

let z = (x<=y) && (a>=b);
console.log(z);

z=x<=++y && a++>=b;
//x=25, y=27, a=91, b=91
console.log(z);

z= ++x>=y || a>=b++;
console.log(z);
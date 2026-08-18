let a=[10,90,40,30,60,20,80];
//Before Sorting
console.log(a);

//sorting
for(let i=0;i<a.length;i++){    
    
    for(j=i+1;j<a.length;j++){
        if(a[i]>a[j]){
            let c=a[i];
            a[i]=a[j]
            a[j]=c;
        }
    }
}

console.log(a);
console.log(`Maximum number of array is ${a[a.length-1]}`)
console.log(`Second Maximum number of array is ${a[a.length-2]}`)
console.log(`Lowest number of array is ${a[0]}`)


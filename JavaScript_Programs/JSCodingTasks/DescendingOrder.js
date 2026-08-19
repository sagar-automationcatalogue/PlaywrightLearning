let x=250, y=200, z=30;//z,x,y

if(x>y && x>z){
    console.log("x is greater number",x);
    if(y>z){
        console.log("y is second greater number",y)
        console.log("z is third number",z)
    }else{
        console.log("z is second greater number",z)
        console.log("y is third number",y)
    }
}else if(y>x && y>z){
    console.log("y is greater number",y);
    if(x>z){
        console.log("x is second greater number",x)
        console.log("z is third number",z)
    }else{
        console.log("z is second greater number",z)
        console.log("x is third number",x)
    }
}else if(z>x && z>y){
    console.log("z is greater number",z);
    if(x>y){
        console.log("x is second greater number",x)
        console.log("y is third number",y)
    }else{
        console.log("y is second greater number",y)
        console.log("x is third number",x)
    }
}


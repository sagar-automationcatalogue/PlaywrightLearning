let str = "JavaScript";
console.log(str[0]);

//str[0]="K";
//console.log(str);

str = "K"+str.slice(1);
console.log(str);

console.log(str.at(2))
console.log(str.charAt(25));

let str1= `Playwright aUtOMatioN iS InterEsting`;
str1=str1.toUpperCase();
console.log(str1);

let str2 = str1.toLowerCase();
console.log(str2);

let browser1 = "chrome";
let browser2 = "CHROME";
if(browser1.toLowerCase() == browser2.toLowerCase()){
    console.log(`Both browser strings are same`);
}else{
    console.log(`Both browser strings are not same`);
}

let str3 = `                  automation is    very           Interesting                          `;
console.log(str3);
str3 = str3.trim();
console.log(str3);

//let actualMessage = await page.locator("******").textContent();//       order is placed with orderID 12345     
//console.log(actualMessage.trim());


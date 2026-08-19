//Outer function
function calculateOrderTotal(price:number, quantity:number):void{

    //inner function-1
    function calculateSubTotal():number{
        let totalAmount:number = price * quantity;
        return totalAmount;
    }

    //inner function-2
    function calculateTax(amount:number):number{
        let totalTax:number = amount * 0.18;
        return totalTax;
    }

    let finalAmount:number = calculateSubTotal();
    console.log("Final Amount is :",finalAmount);

    let finalTax:number = calculateTax(finalAmount);
    console.log("Final Tax is :",finalTax);

    let totalFinalAmount:number = finalAmount+finalTax;
    console.log("Total Final AMount is ",totalFinalAmount);

}

calculateOrderTotal(5,20);


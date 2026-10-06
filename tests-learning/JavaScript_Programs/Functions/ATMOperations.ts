let r1=(accountBalance:number, withdrawAmount:number):any =>{
    if(withdrawAmount<=0){
        return "Withdrawal amount must be greater than zero";
    }

    if(accountBalance>=withdrawAmount){
        accountBalance = accountBalance-withdrawAmount;
        console.log("Withdrawal is success and remaining account balance",accountBalance);      
        return accountBalance;  
    }else{
        return "Insufficient Balance";
    }

}

console.log(r1(9000,6000));




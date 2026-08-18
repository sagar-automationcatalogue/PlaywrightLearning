class BankAccount{
    //properties
    accountNumber;
    accountHolderName;
    balance;

    constructor(accNumber:number, accName:string, bal:number){
        this.accountNumber = accNumber;
        this.accountHolderName = accName;
        this.balance = bal;
    }

    //method
    deposit(amount:number){
        this.balance=this.balance+amount;
        console.log(`Deposited Amount ${amount} and new Balance is ${this.balance}`);
    }

    withdraw(amount:number){
         this.balance=this.balance-amount;
         console.log(`Withdrawn Amount ${amount} and new Balance is ${this.balance}`);
    }

    checkBalance(){        
         console.log(`Current Balance is ${this.balance}`);
    }
}

let ob10 = new BankAccount(45454454,`Soujanya`,7500);
ob10.deposit(1000);

let ob20 = new BankAccount(5464514,`Manikanta`,9900);
ob20.deposit(1000);
//ob20.withdraw(20000);

//ob20.checkBalance();


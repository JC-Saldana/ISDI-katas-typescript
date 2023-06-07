class AccountHolder {
  private name: string
  public nextAccountHolder: AccountHolder
  private approveTransaction(transactionRequest: TransactionRequest): boolean {
    // return if approved
  }
}

class Manager extends AccountHolder {
  private approveTransaction(transactionRequest: TransactionRequest): boolean {
    return transactionRequest < 1000
  }
}

class Supervisor extends AccountHolder {
  private approveTransaction(transactionRequest: TransactionRequest): boolean {
    return transactionRequest < 5000
  }
}

class TransactionRequest {
  private amount: number
  private description: string
}

class main {
 
}

// Client

const AccountHolder1 = new Manager()
const AccountHolder2 = new Supervisor()
const AccountHolder3 = new Manager()

import { TransactionRepositories } from "../repositories/TransactionRepositories";

export class transactionServices {
  protected transactionServices: any;

  constructor(private transactionRepositories: TransactionRepositories) {
    this.transactionServices = transactionRepositories;
  }

  async findAllDataTransaction() {
    return await this.transactionServices.findAllDataTransaction();
  }
}

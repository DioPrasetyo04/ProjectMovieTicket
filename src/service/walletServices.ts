import { IWalletRepositories } from "../interfaces/IWalletRepositories";

export class walletServices {
  protected transactionServices: any;

  constructor(private transactionRepositories: IWalletRepositories) {
    this.transactionServices = transactionRepositories;
  }

  async findAllDataTransaction() {
    return await this.transactionServices.findAllDataTransaction();
  }
}

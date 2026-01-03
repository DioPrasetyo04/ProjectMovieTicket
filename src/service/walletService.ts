import { WalletRepositories } from "../repositories/WalletRepositories";

export class walletServices {
  protected walletServices: any;

  constructor(private walletRepositories: WalletRepositories) {
    this.walletServices = walletRepositories;
  }

  async findAllDataWallet() {
    return await this.walletServices.findAllDataTransaction();
  }
}

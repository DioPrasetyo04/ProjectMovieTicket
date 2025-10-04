import WalletTransactionModel from "../models/WalletTransactionModel";
import { WalletTransactions } from "../fitur_interfaces/InterfaceWalletTransactions";
import { IWalletRepositories } from "../interfaces/IWalletRepositories";

export class WalletRepositories implements IWalletRepositories {
  async findAllDataTransaction(): Promise<WalletTransactions[] | null> {
    const data = await WalletTransactionModel.find()
      .populate({
        path: "wallet_id",
        model: "Wallet",
        select: "balance user_id",
        populate: {
          path: "user_id",
          model: "User",
          select: "name email",
        },
      })
      .lean();

    return data;
  }
}

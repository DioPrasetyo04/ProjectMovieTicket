import { ObjectId } from "mongoose";
import { WalletTransactions } from "../fitur_interfaces/InterfaceWalletTransactions";
import { Wallet } from "../fitur_interfaces/InterfaceWallet";

export interface IWalletRepositories {
  findAllDataTransaction(): Promise<WalletTransactions[] | null>;
}

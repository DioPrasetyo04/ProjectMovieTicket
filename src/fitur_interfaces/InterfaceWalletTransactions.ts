import { ObjectId } from "mongoose";

export interface WalletTransactions {
  wallet_id?: ObjectId;
  price?: number;
  status?: string;
}

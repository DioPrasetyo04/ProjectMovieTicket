import { ObjectId } from "mongoose";

export interface Wallet {
  user_id?: ObjectId;
  balance: number;
}

import { ObjectId } from "mongoose";

export interface TransactionSeat {
  transaction_id?: ObjectId;
  seat: string;
}

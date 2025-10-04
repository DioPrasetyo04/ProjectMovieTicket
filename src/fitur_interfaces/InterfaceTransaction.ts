import { ObjectId } from "mongoose";

export interface Transaction {
  _id: string;
  subtotal: number;
  total: number;
  bookingFee: number;
  tax: number;
  user_id?: ObjectId;
  movie_id?: ObjectId;
  theater_id?: ObjectId;
}

export interface TransactionSeat {
  transaction_id?: ObjectId;
  seat: string;
}

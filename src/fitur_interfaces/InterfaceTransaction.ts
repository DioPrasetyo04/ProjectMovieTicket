import mongoose, { ObjectId } from "mongoose";

export interface Transaction {
  _id: string;
  subtotal: number;
  total: number;
  bookingFee: number;
  tax: number;
  user_id?: ObjectId;
  movie_id?: ObjectId;
  theater_id?: ObjectId;
  date?: String;
  seats?: mongoose.Types.ObjectId[];
}

import mongoose from "mongoose";
import { Transaction } from "../fitur_interfaces/InterfaceTransaction";

const transactionSchema = new mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    bookingFee: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      model: "User",
      required: true,
    },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",
      model: "Movie",
      required: true,
    },
    theater_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theaters",
      model: "Theater",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seats: [
      {
        ref: "transactionSeats",
        model: "TransactionSeat",
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<Transaction>(
  "Transaction",
  transactionSchema,
  "transactions"
);

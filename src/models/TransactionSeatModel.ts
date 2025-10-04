import mongoose from "mongoose";
import { TransactionSeat } from "../fitur_interfaces/InterfaceTransactionSeat";

const TransactionSeatSchema = new mongoose.Schema({
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  seat: [
    {
      type: String,
      required: true,
    },
  ],
});

export default mongoose.model<TransactionSeat>(
  "TransactionSeat",
  TransactionSeatSchema,
  "transactionSeats"
);

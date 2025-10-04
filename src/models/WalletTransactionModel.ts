import mongoose from "mongoose";
import { WalletTransactions } from "../fitur_interfaces/InterfaceWalletTransactions";

const walletTransactionSchema = new mongoose.Schema({
  wallet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});

export default mongoose.model<WalletTransactions>(
  "WalletTransaction",
  walletTransactionSchema,
  "walletTransactions"
);

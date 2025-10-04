import mongoose from "mongoose";
import { Wallet } from "../fitur_interfaces/InterfaceWallet";

const walletSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
});

export default mongoose.model<Wallet>("Wallet", walletSchema, "wallets");

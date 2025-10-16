import mongoose from "mongoose";
import { Wallet } from "../fitur_interfaces/InterfaceWallet";

const walletSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    model: "User",
    ref: "users",
    required: true,
  },
  // balance untuk saldo transaksi user
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
});

export default mongoose.model<Wallet>("Wallet", walletSchema, "wallets");

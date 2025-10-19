import { Response } from "express";
import { CustomRequest } from "../types/Request";
import { transactionSchema } from "../utils/zodSchema";
import WalletModel from "../models/WalletModel";
import z from "zod";
import TransactionModel from "../models/TransactionModel";
import TransactionSeatModel from "../models/TransactionSeatModel";
import WalletTransactionModel from "../models/WalletTransactionModel";

export const transactionTicket = async (req: CustomRequest, res: Response) => {
  try {
    const parseData = transactionSchema.safeParse(req.body);

    if (!parseData.success) {
      return res.status(400).json({
        message: "Invalid Request Data",
        error_data: parseData.error.issues.map((err) => err.message).join(","),
        status: "false",
      });
    }

    const findWallet = await WalletModel.findOne({ user_id: req.user?.id });

    if (!findWallet || findWallet.balance < parseData.data.total) {
      return res.status(400).json({
        message: "Insufficent Balance, please top up your balance first",
        data: null,
        status: "false",
      });
    }

    const transaction = new TransactionModel({
      bookingFee: parseData.data.bookingFee,
      subtotal: parseData.data.subtotal,
      tax: parseData.data.tax,
      theater_id: parseData.data.theaterId,
      movie_id: parseData.data.movieId,
      user_id: req.user?.id,
      date: parseData.data.date,
    });

    for (const seat of parseData.data.seats) {
      const newSeat = new TransactionSeatModel({
        transaction_id: transaction._id,
        seat: seat,
      });

      await newSeat.save();
    }

    const transactionSeats = await TransactionSeatModel.find({
      transaction_id: transaction._id,
    });

    transaction.seats = transactionSeats.map((value) => value._id);

    const currBalance = findWallet.balance ?? 0;

    const updateWallet = await WalletModel.findByIdAndUpdate(findWallet._id, {
      $set: {
        balance: currBalance - parseData.data.total,
      },
      new: true,
    }).select("balance");

    await transaction.save();

    return res.status(200).json({
      message: "Transaction Success",
      data: {
        Data_transaction: transaction,
        Data_wallet: updateWallet,
      },
      status: "true",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Transaction Failed",
      data: error,
      status: "false",
    });
  }
};

import type { Transaction } from "../fitur_interfaces/InterfaceTransaction";
import ITransactionRepositories from "../interfaces/ITransactionRepositories";
import TransactionModel from "../models/TransactionModel";
import TransactionSeatModel from "../models/TransactionSeatModel";

export class TransactionRepositories implements ITransactionRepositories {
  async findAllDataTransaction(): Promise<Transaction[] | null> {
    const data = await TransactionModel.find()
      .populate({
        path: "user_id",
        model: "User",
        select: "name",
      })
      .populate({
        path: "movie_id",
        model: "Movie",
        select: "title",
      })
      .populate({
        path: "theater_id",
        model: "Theater",
        select: "name",
      })
      .populate({
        path: "seats",
        model: "TransactionSeat",
        select: "transaction_id seat",
      });

    return data;
  }
}

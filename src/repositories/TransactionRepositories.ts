import {
  Transaction,
  TransactionSeat,
} from "../fitur_interfaces/InterfaceTransaction";
import ITransactionRepositories from "../interfaces/ITransactionRepositories";
import TransactionSeatModel from "../models/TransactionSeatModel";

export class TransactionRepositories implements ITransactionRepositories {
  async findAllDataTransaction(): Promise<TransactionSeat[] | null> {
    const data = await TransactionSeatModel.find().populate({
      path: "transaction_id",
      model: "Transaction",
      select: "subtotal total bookingFee tax user_id movie_id theater_id",
      populate: {
        path: "user_id",
        model: "User",
        select: "name email",
        populate: {
          path: "movie_id",
          model: "Movie",
          select: "title slug",
          populate: {
            path: "theater_id",
            model: "Theater",
            select: "name city slug",
          },
        },
      },
    });
    return data;
  }
}

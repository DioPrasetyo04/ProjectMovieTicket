import { Request, Response } from "express";
import WalletModel from "../models/WalletModel";
import type { CustomRequest } from "../types/Request";
import WalletTransactionModel from "../models/WalletTransactionModel";
import { topUpSchema } from "../utils/zodSchema";
import { Buffer } from "node:buffer";

export const getBalance = async (req: CustomRequest, res: Response) => {
  try {
    const wallet = await WalletModel.findOne({
      user_id: req.user?.id,
    }).populate<{ user_id: { name: string; email: string } }>({
      path: "user_id",
      model: "User",
      select: "name email",
    });

    if (!wallet) {
      return res.status(404).json({
        message: `Wallet Not Found`,
        data: null,
        status: "false",
      });
    }

    return res.status(200).json({
      message: `Get Data Saldo Wallet Success ${wallet.user_id?.name}`,
      data: wallet,
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Saldo Data Wallet",
      data: error,
      status: "false",
    });
  }
};

export const getToupHistory = async (req: CustomRequest, res: Response) => {
  try {
    const walletUser = await WalletModel.findOne({
      user_id: req.user?.id,
    });

    const dataHistoryWallet = await WalletTransactionModel.find({
      wallet_id: walletUser?._id,
    }).select("wallet price createdAt status");

    if (!dataHistoryWallet || dataHistoryWallet.length === 0) {
      return res.status(404).json({
        message: "Not Found Data Top Up History",
        data: null,
        status: "false",
      });
    }

    return res.status(200).json({
      message: "Get Data Top Up History Success",
      data: dataHistoryWallet,
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Top Up Data History",
      data: error,
      status: "false",
    });
  }
};

export const toUpBalance = async (req: CustomRequest, res: Response) => {
  try {
    const parsedData = topUpSchema.parse(req.body);

    const midtransUrl = process.env.MIDTRANS_URL_SANDBOX;

    const midtransAuth = Buffer.from(
      process.env.MIDTRANS_SERVER_KEY + ":"
    ).toString("base64");

    if (parsedData.balance <= 1000) {
      return res.status(400).json({
        message: "Balance must be greater than 1000",
        data: null,
        status: "false",
      });
    }

    if (!midtransUrl || !midtransAuth) {
      console.error(
        "Midtrans URL or Midtrans Auth String is not configured in .env"
      );
      return res.status(500).json({
        message: "Server configuration error.",
        status: "false",
      });
    }

    const findWalletUser = await WalletModel.findOne({
      user_id: req.user?.id,
    });

    if (!findWalletUser) {
      return res.status(404).json({
        message: "User wallet not found.",
        data: null,
        status: "false",
      });
    }

    const topUpWalletUser = new WalletTransactionModel({
      wallet_id: findWalletUser?._id,
      price: parsedData.balance,
      status: "pending",
    });

    // template curl data midtrans
    const midtransRequest = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${midtransAuth}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: topUpWalletUser._id,
          gross_amount: parsedData.balance,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: req.user?.email,
          name: req.user?.name,
        },
        callbacks: {
          finish: process.env.MIDTRANS_FINISH_URL,
        },
      }),
    });

    // fetching data midtrans request
    // import to json data midtrans
    const midtransJson = await midtransRequest.json();

    await topUpWalletUser.save();

    return res.status(200).json({
      message: "Success To Up Data Wallet",
      data: midtransJson,
      status: "true",
    });
  } catch (error) {
    console.error("Error in toUpBalance:", error);
    return res.status(500).json({
      message: "Failed To Up Data Wallet",
      detail:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: "false",
    });
  }
};

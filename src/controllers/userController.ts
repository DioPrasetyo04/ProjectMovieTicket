import { Request, Response } from "express";
import { UserRepositories } from "../repositories/UserRepositories";
import { UserService } from "../service/UserService";
import { userSchema, userUpdateSchema } from "../utils/zodSchema";
import path, { parse } from "node:path";
import fs from "node:fs";
import { walletServices } from "../service/walletServices";
import bcrypt from "bcrypt";
import { TransactionRepositories } from "../repositories/TransactionRepositories";

const userRepos = new UserRepositories();
const userServices = new UserService(userRepos);
const Transaction = new TransactionRepositories();
const walletService = new walletServices(Transaction as any);

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const getAllUser = await userServices.getAllDataUser();

    if (getAllUser.length === 0) {
      return res.json({
        data: [],
        message: "Success But No Data Found",
        status: 200,
      });
    }

    return res.status(200).json({
      data: getAllUser,
      message: "Success Get Data User",
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Data User",
      data: err,
      status: false,
    });
  }
};

export const findDetailDataUser = async (req: Request, res: Response) => {
  const email = req.params.email as string;

  try {
    const findUser = await userServices.findDetailDataUser(email);

    if (!findUser) {
      return res.json({
        message: "Data Not Found",
        status: false,
        data: null,
      });
    }

    return res.status(200).json({
      data: findUser,
      message: "Success Get Detail Data User",
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Detail Data User",
      data: err,
      status: false,
    });
  }
};

export const postDataUser = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Photo is required",
        data: null,
        status: false,
      });
    }

    const parseData = userSchema.safeParse({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      photo: req.file.filename,
    });

    if (!parseData.success) {
      const errorMessages = parseData.error.issues
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        message: "Validation Error",
        detail: errorMessages,
        status: false,
      });
    }

    // umumnya salt yang digunakan adalah 10 untuk merandom password sebanyak 10 kali secara acak
    if (parseData.data.password) {
      parseData.data.password = bcrypt.hashSync(parseData.data.password, 10);
    }

    const newUser = await userServices.postDataUser({
      ...parseData.data,
      photo: req.file.filename,
    });

    return res.status(200).json({
      data: newUser,
      message: "Success Post Data User",
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Post Data User",
      data: err,
      status: false,
    });
  }
};

export const updateDataUser = async (req: Request, res: Response) => {
  try {
    const email = req.params.email as string;

    const findUser = await userServices.findDetailDataUser(email);

    if (!findUser) {
      return res.json({
        message: "Data Not Found",
        status: false,
        data: null,
      });
    }

    const parsedData = userUpdateSchema.safeParse({
      name: req.body.name ? req.body.name : findUser.name,
      email: req.body.email ? req.body.email : findUser.email,
      password: req.body.password ? req.body.password : findUser.password,
      role: req.body.role ? req.body.role : findUser.role,
    });

    if (!parsedData.success) {
      const errorMessages = parsedData.error.issues
        .map((err) => err.message)
        .join(",");

      return res.status(400).json({
        message: "Validation Error",
        detail: errorMessages,
        status: false,
      });
    }

    if (req.file) {
      const dirname = path.resolve();
      const filePath = path.join(
        dirname,
        "public/images/photos",
        findUser.photo ?? ""
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // umumnya salt yang digunakan adalah 10 untuk merandom password sebanyak 10 kali secara acak
    if (req.body.password && parsedData.data.password) {
      parsedData.data.password = bcrypt.hashSync(parsedData.data.password, 10);
    }

    const updatedUser = await userServices.updateDataUser(email, {
      ...parsedData.data,
      photo: req.file ? req.file.filename : findUser.photo,
    });

    return res.status(200).json({
      data: updatedUser,
      message: "Success Update Data User",
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Update Data User",
      data: err,
      status: false,
    });
  }
};

export const deleteDataUser = async (req: Request, res: Response) => {
  try {
    const email = req.params.email as string;

    const findUser = await userServices.findDetailDataUser(email);

    if (!findUser) {
      return res.json({
        message: "Data Not Found",
        status: false,
        data: null,
      });
    }

    if (findUser.photo !== null) {
      const dirname = path.resolve();
      const filePath = path.join(
        dirname,
        "public/images/photos",
        findUser.photo ?? ""
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await userServices.deleteDataUser(email);
    return res.status(200).json({
      message: "Success Delete Data User",
      status: true,
      data: findUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Delete Data User",
      data: err,
      status: false,
    });
  }
};

export const getWalletUser = async (req: Request, res: Response) => {
  try {
    const getAllDataTransaction = await walletService.findAllDataTransaction();
    if (getAllDataTransaction.length === 0) {
      return res.status(200).json({
        data: [],
        message: "Success But No Data Found",
        status: "Ok",
      });
    }
    return res.status(200).json({
      data: getAllDataTransaction,
      message: "Success Get Data Transaction",
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Data User",
      data: err,
      status: false,
    });
  }
};

export const getTransactionUser = async (req: Request, res: Response) => {
  try {
    const getAllDataTransaction = await walletService.findAllDataTransaction();
    if (getAllDataTransaction.length === 0) {
      return res.status(200).json({
        data: [],
        message: "Success But No Data Found",
        status: "Ok",
      });
    }
    return res.status(200).json({
      data: getAllDataTransaction,
      message: "Success Get Data Transaction",
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Data User",
      data: err,
      status: false,
    });
  }
};

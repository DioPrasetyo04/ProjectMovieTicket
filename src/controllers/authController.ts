import { Request, Response } from "express";
import { authSchema } from "../utils/zodSchema";
import UsersModel from "../models/UsersModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import WalletModel from "../models/WalletModel";
import AuthModel from "../models/AuthModel";
import { date } from "zod";

export const login = async (req: Request, res: Response) => {
  try {
    // omit berfungsi untuk menghilangkan field tertentu atau attribute dari schema tertentu berbentuk boolean
    const parsedData = authSchema
      .omit({
        name: true,
      })
      .parse(req.body);

    const checkUser = await UsersModel.findOne({
      email: parsedData.email,
      role: parsedData.role,
    });

    if (!checkUser) {
      return res.status(404).json({
        message: "User Not Found or Email Not Registration",
        data: null,
        info: "failed",
      });
    }

    // check password decrypt password database dan cocokkan dengan password yang dikirim body json oleh user
    const comparePassword = bcrypt.compareSync(
      parsedData.password,
      checkUser.password
    );

    if (!comparePassword) {
      return res.status(400).json({
        message: "Email/Password Invalid",
        data: null,
        info: "failed",
      });
    }

    const scretKey = process.env.SECRET_KEY ?? "";

    // auth to jwt(json web token)
    const token = jwt.sign(
      {
        data: {
          id: checkUser.id,
        },
      },
      scretKey,
      { expiresIn: "24h" }
    );

    // create AuthModel
    const timeAuth = await AuthModel.create({
      user_id: checkUser.id,
      token: `JWT ${token}`,
      // kalkulasi expiresAt
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const now = new Date();

    if (timeAuth?.expiresAt && timeAuth?.expiresAt <= now) {
      await AuthModel.deleteOne({ _id: timeAuth._id });
      return res.status(401).json({
        message: "Token Expired",
        data: null,
        info: "failed",
      });
    }

    return res.status(200).json({
      message: "Login Success",
      data: {
        name: checkUser.name,
        email: checkUser.email,
        role: checkUser.role,
        photoUrl: (checkUser as any).photoUrl, // Access virtual property directly
        token: `JWT ${token}`,
        expiresAt: timeAuth.expiresAt,
      },
      info: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Login Maybe Database Error Not Connexted",
      data: err,
      info: "failed",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const parsedData = authSchema
      .omit({
        role: true,
      })
      .safeParse({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

    if (!parsedData.success) {
      const errMessages = parsedData.error.issues.map((err) => err.message);
      return res.status(400).json({
        message: "Invalid Request Data",
        detail: errMessages,
        status: "failed",
      });
    }

    const checkEmailExist = await UsersModel.findOne({
      email: parsedData.data.email,
    });

    if (checkEmailExist) {
      return res.status(400).json({
        message: "Email Already Exist",
        data: null,
        status: "failed",
      });
    }

    const hashedPassword = bcrypt.hashSync(parsedData.data.password, 10);

    const newUser = await UsersModel.create({
      name: parsedData.data.name,
      email: parsedData.data.email,
      password: hashedPassword,
      role: "customer",
      photo: req.file?.filename ?? null,
    });

    const wallet = await WalletModel.create({
      balance: 0,
      user_id: newUser.id,
    });

    await newUser.save();
    await wallet.save();

    const findWallet = await WalletModel.findOne({
      user_id: newUser.id,
    }).select("balance");

    return res.status(200).json({
      message: "Register Success",
      data: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        photoUrl: (newUser as any).photoUrl,
        wallet: findWallet,
      },
      status: "Success",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Register Maybe Database Error Not Connexted",
      data: err,
      status: "Failed",
    });
  }
};

import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../types/Request";
import jwt from "jsonwebtoken";
import UsersModel from "../models/UsersModel";

type JWTPayload = {
  // data id user yang sudah sign dengan jwt.sign
  data: {
    id: string;
  };
};

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const secretKey = process.env.SECRET_KEY ?? "";

  if (req.headers?.authorization?.split(" ")[0] === "JWT") {
    const token = req.headers?.authorization?.split(" ")[1];
    // verifikasi token dan add token to header request user id
    const decoded = (await jwt.verify(token, secretKey)) as JWTPayload;

    const user = await UsersModel.findById(decoded.data.id);

    if (!user) {
      return res.status(401).json({
        message: "Token Invalid or User Not Found",
        data: null,
        status: false,
      });
    }

    // Debug: log user role
    // console.log("User role:", user.role, "Type:", typeof user.role);

    // Validasi role
    // if (!user.role || !["admin", "customer"].includes(user.role)) {
    //   return res.status(401).json({
    //     message: "Invalid user role",
    //     data: null,
    //     status: false,
    //   });
    // }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "customer",
    };
    next();
  } else {
    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      status: false,
    });
  }
};

export const verifyRole =
  (type: "admin" | "customer") =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req?.user?.role === type) {
      return next();
    }

    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      status: false,
    });
  };

export const verifyRoles =
  (...types: Array<"admin" | "customer">) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req?.user?.role && types.includes(req.user.role)) {
      return next();
    }

    return res.status(401).json({
      message: "Unauthorized",
      data: null,
      status: false,
    });
  };

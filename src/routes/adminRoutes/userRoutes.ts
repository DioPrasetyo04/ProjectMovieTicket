import express from "express";
import {
  deleteDataUser,
  findDetailDataUser,
  getAllUser,
  getTransactionUser,
  getWalletUser,
  postDataUser,
  updateDataUser,
} from "../../controllers/userController";
import { validateRequest } from "../../middlewares/validateRequest";
import { userSchema, userUpdateSchema } from "../../utils/zodSchema";
import { uploadDynamic } from "../../utils/multer";

const userRoutes = express.Router();

userRoutes.get("/users", getAllUser);
userRoutes.post(
  "/users",
  uploadDynamic.single("photo"),
  postDataUser,
  validateRequest(userSchema)
);
userRoutes.get("/user/:email", findDetailDataUser);
userRoutes.put(
  "/user/:email",
  uploadDynamic.single("photo"),
  updateDataUser,
  validateRequest(userUpdateSchema)
);
userRoutes.delete("/user/:email", deleteDataUser);
userRoutes.get("/wallet-transactions", getWalletUser);
userRoutes.get("/ticket-transactions", getTransactionUser);

export default userRoutes;

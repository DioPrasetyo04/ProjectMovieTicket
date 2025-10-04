import express from "express";
import multer from "multer";
import { getPublicPhotoUrl } from "../../utils/helper";
import { imageFilter, photoStorage } from "../../utils/multer";
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

const uploadPhoto = multer({
  storage: photoStorage(),
  fileFilter: imageFilter,
});
const userRoutes = express.Router();

userRoutes.get("/users", getAllUser);
userRoutes.post(
  "/users",
  uploadPhoto.single("photo"),
  postDataUser,
  validateRequest(userSchema)
);
userRoutes.get("/user/:email", findDetailDataUser);
userRoutes.put(
  "/user/:email",
  uploadPhoto.single("photo"),
  updateDataUser,
  validateRequest(userUpdateSchema)
);
userRoutes.delete("/user/:email", deleteDataUser);
userRoutes.get("/wallet-transactions", getWalletUser);
userRoutes.get("/ticket-transactions", getTransactionUser);

export default userRoutes;

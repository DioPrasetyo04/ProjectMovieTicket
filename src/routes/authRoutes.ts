import express from "express";
import { login, register } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { authSchema } from "../utils/zodSchema";
import multer from "multer";
import { imageFilter, photoStorage } from "../utils/multer";

const authRoutes = express.Router();

// upload file to server express js by multer disk storage engine
const upload = multer({
  storage: photoStorage(),
  fileFilter: imageFilter,
});

authRoutes.post(
  "/login",
  validateRequest(authSchema.omit({ name: true })),
  login
);

authRoutes.post("/register", upload.single("photo"), register);

export default authRoutes;

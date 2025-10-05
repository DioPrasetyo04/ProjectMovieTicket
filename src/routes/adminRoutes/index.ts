import express from "express";
import genreRoutes from "./genreRoutes";
import theaterRoutes from "./theaterRoutes";
import movieRoutes from "./movieRoutes";
import userRoutes from "./userRoutes";
import { verifyRole, verifyToken } from "../../middlewares/verifyToken";

const adminRoutes = express.Router();

// verify token terlebih dahulu
adminRoutes.use(verifyToken);
// verify role untuk mengatur fitur dan page admin
adminRoutes.use(verifyRole("admin"));
adminRoutes.use(genreRoutes);
adminRoutes.use(theaterRoutes);
adminRoutes.use(movieRoutes);
adminRoutes.use(userRoutes);

export default adminRoutes;

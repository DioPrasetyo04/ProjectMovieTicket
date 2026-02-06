import express from "express";
import homeRoutes from "./homeRoutes";
import {
  verifyRole,
  verifyRoles,
  verifyToken,
} from "../../middlewares/verifyToken";
import walletRoutes from "./walletRoutes";

const customerRoutes = express.Router();

customerRoutes.use(verifyToken);
customerRoutes.use(verifyRoles("customer", "admin"));
customerRoutes.use(homeRoutes);
customerRoutes.use(walletRoutes);

export default customerRoutes;

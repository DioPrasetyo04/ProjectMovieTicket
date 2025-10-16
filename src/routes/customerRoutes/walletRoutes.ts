import express from "express";
import {
  getBalance,
  getToupHistory,
  toUpBalance,
} from "../../controllers/walletController";
import { validateRequest } from "../../middlewares/validateRequest";
import { topUpSchema } from "../../utils/zodSchema";

const walletRoutes = express.Router();

walletRoutes.get("/check-balance", getBalance);
walletRoutes.get("/topup-history", getToupHistory);
walletRoutes.post("/topup", validateRequest(topUpSchema), toUpBalance);

export default walletRoutes;

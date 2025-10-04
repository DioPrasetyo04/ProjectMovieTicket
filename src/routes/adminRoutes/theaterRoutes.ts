import express from "express";
import {
  deleteDataTheater,
  getAllTheater,
  getDetailTheater,
  postDataTheater,
  updateDataTheater,
} from "../../controllers/theaterController";
import { theaterSchema, theaterUpdateSchema } from "../../utils/zodSchema";
import { validateRequest } from "../../middlewares/validateRequest";

const theaterRoutes = express.Router();

theaterRoutes.get("/theaters", getAllTheater);
theaterRoutes.get("/theater/:slug", getDetailTheater);
theaterRoutes.post(
  "/theaters",
  validateRequest(theaterSchema),
  postDataTheater
);
theaterRoutes.put(
  "/theater/:slug",
  validateRequest(theaterUpdateSchema),
  updateDataTheater
);

theaterRoutes.delete("/theater/:slug", deleteDataTheater);

export default theaterRoutes;

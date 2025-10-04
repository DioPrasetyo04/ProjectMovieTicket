import express from "express";
import {
  postGenre,
  getGenres,
  updateGenre,
  deleteGenre,
  getDetailGenre,
} from "../../controllers/genreController";
import { validateRequest } from "../../middlewares/validateRequest";
import { genreSchema, genreUpdateSchema } from "../../utils/zodSchema";

// import router dari express router untuk menyimpan route
const genreRoutes = express.Router();

genreRoutes.get("/genres", getGenres);
genreRoutes.get("/genre/:slug", getDetailGenre);
genreRoutes.post("/genres", validateRequest(genreSchema), postGenre);
genreRoutes.put(
  "/genre/:slug",
  validateRequest(genreUpdateSchema),
  updateGenre
);
genreRoutes.delete("/genre/:slug", deleteGenre);

export default genreRoutes;

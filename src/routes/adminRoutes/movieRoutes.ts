import express from "express";
import {
  deleteMovie,
  getDetailMovie,
  getMovies,
  postMovie,
  updateMovie,
} from "../../controllers/movieController";
import multer from "multer";
import { imageFilter, thumbnailStorage } from "../../utils/multer";
import { validateRequest } from "../../middlewares/validateRequest";
import { movieSchema, movieUpdateSchema } from "../../utils/zodSchema";

const upload = multer({ storage: thumbnailStorage(), fileFilter: imageFilter });
const movieRoutes = express.Router();

movieRoutes.get("/movies", getMovies);
movieRoutes.post(
  "/movies",
  upload.single("thumbnail"),
  postMovie,
  validateRequest(movieSchema)
);
movieRoutes.put(
  "/movie/:slug",
  upload.single("thumbnail"),
  updateMovie,
  validateRequest(movieUpdateSchema)
);
movieRoutes.get("/movie/:slug", getDetailMovie);
movieRoutes.delete("/movie/:slug", deleteMovie);

export default movieRoutes;

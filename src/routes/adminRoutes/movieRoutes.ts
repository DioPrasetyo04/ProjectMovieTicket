import express from "express";
import {
  deleteMovie,
  getDetailMovie,
  getMovies,
  postMovie,
  updateMovie,
} from "../../controllers/movieController";
import { validateRequest } from "../../middlewares/validateRequest";
import { movieSchema, movieUpdateSchema } from "../../utils/zodSchema";
import { uploadDynamic } from "../../utils/multer";

// const uploadThumnail = multer({
//   storage: thumbnailStorage(),
//   fileFilter: imageFilter,
// });

// const uploadVideo = multer({
//   storage: videoTrailerStorage(),
//   fileFilter: imageFilter,
// });

const movieRoutes = express.Router();

movieRoutes.get("/movies", getMovies);
movieRoutes.post(
  "/movies",
  uploadDynamic.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video_trailer", maxCount: 1 },
  ]),
  postMovie,
  validateRequest(movieSchema)
);
movieRoutes.put(
  "/movie/:slug",
  uploadDynamic.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video_trailer", maxCount: 1 },
  ]),
  updateMovie,
  validateRequest(movieUpdateSchema)
);
movieRoutes.get("/movie/:slug", getDetailMovie);
movieRoutes.delete("/movie/:slug", deleteMovie);

export default movieRoutes;

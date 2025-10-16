import express from "express";
import { getMovies } from "../../controllers/movieController";
import { getGenres } from "../../controllers/genreController";
import {
  get3Genres,
  get3movies,
  getMovieDetail,
  getMoviesFilter,
} from "../../controllers/homeController";

const homeRoutes = express.Router();

homeRoutes.get("/movies", getMovies);
homeRoutes.get("/movies3", get3movies);
homeRoutes.get("/genres", getGenres);
homeRoutes.get("/genres3", get3Genres);
homeRoutes.get("/movie/:slug", getMovieDetail);
homeRoutes.get("/browse-movies/:slug", getMoviesFilter);

export default homeRoutes;

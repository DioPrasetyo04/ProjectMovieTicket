import express from "express";
import { getMovies } from "../../controllers/movieController";
import { getGenres } from "../../controllers/genreController";
import {
  get3Genres,
  get3movies,
  getAvailableSeats,
  getMovieDetail,
  getMoviesFilter,
} from "../../controllers/homeController";
import { validateRequest } from "../../middlewares/validateRequest";
import { transactionSchema } from "../../utils/zodSchema";
import {
  getOrderDetail,
  getOrders,
  transactionTicket,
} from "../../controllers/ticketController";
import { getAllTheater } from "../../controllers/theaterController";

const homeRoutes = express.Router();

homeRoutes.get("/movies", getMovies);
homeRoutes.get("/movies3", get3movies);
homeRoutes.get("/genres", getGenres);
homeRoutes.get("/genres3", get3Genres);
homeRoutes.get("/movie/:slug", getMovieDetail);
homeRoutes.get("/browse-movies/:genreId", getMoviesFilter);
homeRoutes.post(
  "/transaction/buy",
  validateRequest(transactionSchema),
  transactionTicket,
);
homeRoutes.get("/orders", getOrders);
homeRoutes.get("/orders/:id", getOrderDetail);
homeRoutes.get("/theaters", getAllTheater);
homeRoutes.get("/check-seats/:movieId", getAvailableSeats);

export default homeRoutes;

import type { Request, Response } from "express";
import { HomeRepositories } from "../repositories/HomeRepositories";
import { HomeServices } from "../service/HomeServices";
import MovieModel from "../models/MovieModel";

const homeRepo = new HomeRepositories();
const homeServices = new HomeServices(homeRepo);

export const getmovies = async (req: Request, res: Response) => {
  try {
    const getMovies = await homeServices.findAllDataMovies();

    return res.status(200).json({
      message: "Success Get Data Movies",
      data: getMovies,
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Data Movies",
      data: error,
      status: "false",
    });
  }
};

export const get3movies = async (req: Request, res: Response) => {
  try {
    const get3Movies = await homeServices.find3DataMovies();
    return res.status(200).json({
      message: "Success Get Data Movies",
      data: get3Movies,
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Data Movies",
      data: error,
      status: "false",
    });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const getGenres = await homeServices.findAllDataGenres();

    return res.status(200).json({
      message: "Success Get Data Genres",
      data: getGenres,
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Data Genres",
      data: error,
      status: "false",
    });
  }
};

export const get3Genres = async (req: Request, res: Response) => {
  try {
    const get3Genres = await homeServices.find3DataGenres();
    return res.status(200).json({
      message: "Success Get Data Genres",
      data: get3Genres,
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Data Genres",
      data: error,
      status: "false",
    });
  }
};

export const getMovieDetail = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const movie = await MovieModel.findOne({ slug })
      .populate({
        path: "theaters",
        select: "name city slug layout[total_rows, seat_per_row, seats[]]",
      })
      .populate({
        path: "genre",
        select: "name slug",
      });

    return res.status(200).json({
      message: "Success Get Data Genres",
      data: {
        movie: {
          ...movie?.toJSON(),
          times: ["12.30", "14.50", "18.30", "23:30"],
        },
      },
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Data Genres",
      data: error,
      status: "false",
    });
  }
};

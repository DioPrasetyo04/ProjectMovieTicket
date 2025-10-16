import type { Request, Response } from "express";
import { HomeRepositories } from "../repositories/HomeRepositories";
import { HomeServices } from "../service/HomeServices";
import MovieModel from "../models/MovieModel";
import TransactionModel from "../models/TransactionModel";
import TheaterModel from "../models/TheaterModel";
import mongoose from "mongoose";

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
        select: "name city slug layout total_seats",
      })
      .populate({
        path: "genre",
        select: "name slug",
      });

    if (!movie) {
      return res.status(404).json({
        message: "Movie Not Found",
        data: null,
        status: "false",
      });
    }

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
      message: "Failed Get Data Movies",
      data: error,
      status: "false",
    });
  }
};

export const getAvailableSeats = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const date = req.query.date as string;

    const transactions = await TransactionModel.find({
      date: date?.toString().replace("+", " "),
      movie_id: slug,
    })
      .select("seats")
      .populate({
        path: "seats",
        model: "TransactionSeat",
        select: "seat",
      });

    const seats = [];

    for (const seat of transactions) {
      seats.push(...(seat as any).seats);
    }

    return res.status(200).json({
      message: "Success Get Data Genres",
      data: seats,
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Data",
      data: error,
      status: "false",
    });
  }
};

export const getMoviesFilter = async (req: Request, res: Response) => {
  try {
    // filtered movie berdasarkan genre
    const { genreId } = req.params;
    // filter tambahan berdasarkan city, theaters, dan availability
    const { city, theaters, availability } = req.query;

    // console.log("Filter params:", { genreId, city, theaters, availability });

    let filterQuery = {} as any;

    if (genreId) {
      filterQuery = {
        ...filterQuery,
        genre: genreId,
      };
    }

    if (city) {
      const findCityTheaters = await TheaterModel.find({
        city: city,
      });

      if (!findCityTheaters.length) {
        return res.status(404).json({
          message: "City Not Found",
          data: null,
          status: "false",
        });
      }

      const theaterIds = findCityTheaters.map((theater) => theater._id);

      filterQuery = {
        ...filterQuery,
        theaters: { $in: [...theaterIds] },
      };
    }

    if (theaters) {
      const theaterArray = Array.isArray(theaters) ? theaters : [theaters];
      const theaterList = theaterArray.map(
        (theater) => new mongoose.Types.ObjectId(theater as string)
      );

      filterQuery = {
        ...filterQuery,
        theaters: {
          $in: [...(filterQuery?.theaters?.$in ?? []), ...theaterList],
        },
      };
    }

    if (availability === "true") {
      filterQuery = {
        ...filterQuery,
        available: true,
      };
    }

    // console.log("Final filterQuery:", filterQuery);
    const moviesFilter = await MovieModel.find({
      ...filterQuery,
    })
      .select("title slug thumbnail genre theaters")
      .populate({
        path: "genre",
        model: "Genre",
        select: "id name slug",
      })
      .populate({
        path: "theaters",
        model: "Theater",
        select: "name city slug layout total_seats",
      });

    const allMovies = await MovieModel.find()
      .select("title slug thumbnail genre theaters")
      .populate({
        path: "genre",
        model: "Genre",
        select: "id name slug",
      })
      .populate({
        path: "theaters",
        model: "Theater",
        select: "name city slug layout total_seats",
      });

    return res.status(200).json({
      message: "Success Get Data Movies",
      data: {
        filteredMovies: moviesFilter,
        allDataMovies: allMovies,
      },
      status: "true",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed Get Data",
      data: error,
      status: "false",
    });
  }
};

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
        select: "name address city slug layout total_seats",
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
      message: "Success Get Data Movies",
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
    const movieId = req.params.movieId;
    const date = req.query.date as string | undefined;

    const filter: any = {
      movie_id: new mongoose.Types.ObjectId(movieId),
    };

    // kalau query date ada baru dipakai
    if (date) {
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);

      if (!match) {
        return res.status(400).json({
          message: "Invalid date format",
          status: "false",
        });
      }

      const [_, year, month, day, hour, minute] = match;

      const dateObj = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        0,
        0,
      );

      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          message: "Invalid date format",
          status: "false",
        });
      }

      /**
       * ✅ RANGE FILTER (lebih aman daripada exact match)
       * karena timestamp di DB bisa punya detik/millisecond
       *
       * range 1 menit:
       * 12:30:00.000 - 12:30:59.999
       */
      const start = new Date(dateObj);
      start.setSeconds(0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 1);

      filter.date = { $gte: start, $lt: end };
    }

    const transactions = await TransactionModel.find(filter)
      .select("seats")
      .populate({
        path: "seats",
        model: "TransactionSeat",
        select: "seat",
      });

    const seats: any[] = [];
    for (const trx of transactions) {
      seats.push(...(trx as any).seats);
    }

    return res.status(200).json({
      message: "Success Get Data Check Seats",
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

    if (!genreId) {
      return res.status(400).json({
        message: "Genre ID is required",
        data: null,
        status: "false",
      });
    }

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
        (theater) => new mongoose.Types.ObjectId(theater as string),
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
      .select("_id title slug thumbnail genre theaters")
      .populate({
        path: "genre",
        model: "Genre",
        select: "_id name slug",
      })
      .populate({
        path: "theaters",
        model: "Theater",
        select: "name city slug layout total_seats",
      });

    const allMovies = await MovieModel.find()
      .select("_id title slug thumbnail genre theaters")
      .populate({
        path: "genre",
        model: "Genre",
        select: "_id name slug",
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

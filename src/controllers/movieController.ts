import { Request, Response } from "express";
import { MovieRepositories } from "../repositories/MovieRepositories";
import { MovieServices } from "../service/MovieServices";
import { movieSchema, movieUpdateSchema } from "../utils/zodSchema";
import path from "node:path";
import fs from "node:fs";
import GenreModel from "../models/GenreModel";
import TheaterModel from "../models/TheaterModel";
const movieRepo = new MovieRepositories();
const movieService = new MovieServices(movieRepo);

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await movieService.findAllData();
    if (movies === null || movies.length === 0) {
      return res.status(200).json({
        data: [],
        message: "Success But No Data Found",
        status: 200,
      });
    }
    return res.status(200).json({
      data: movies,
      message: "Success Get Data Movies",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Data Movies",
      status: 500,
      data: err,
    });
  }
};

export const postMovie = async (req: Request, res: Response) => {
  try {
    const uploadFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const files = uploadFiles;

    if (!files.thumbnail || !files.video_trailer) {
      return res.status(400).json({
        message: "Both thumbnail image and video trailer are required",
        data: null,
        status: "Failed",
      });
    }

    const parseData = movieSchema.safeParse({
      title: req.body.title,
      started_time: req.body.started_time,
      duration: req.body.duration,
      genre: req.body.genre ? req.body.genre : null,
      theaters: req.body.theaters ? req.body.theaters.split(",") : [],
      available: req.body.available === "1" ? true : false,
      description: req.body.description ? req.body.description : null,
      price: Number(req.body.price) ? Number(req.body.price) : 0,
      bonus: req.body.bonus ? req.body.bonus : null,
    });

    if (!parseData.success) {
      const errorMessages = parseData.error.issues
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        message: "Invalid Request Data",
        detail: errorMessages,
        status: "Failed",
      });
    }

    const newMovie = await movieService.postData({
      ...parseData.data,
      thumbnail: files.thumbnail[0].filename,
      video_trailer: files.video_trailer[0].filename,
    });

    return res.status(200).json({
      message: "Success Post Data Movies",
      data: newMovie,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Post Data Movies",
      status: 500,
      data: err,
    });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const findMovie = await movieService.findDetailData(slug);

  if (!findMovie) {
    return res.status(404).json({
      message: "Data Movie not found",
      status: 404,
      data: null,
    });
  }
  try {
    const parseData = movieUpdateSchema.safeParse({
      title: req.body.title,
      started_time: req.body.started_time || findMovie.started_time,
      duration: req.body.duration || findMovie.duration,
      genre: req.body.genre
        ? req.body.genre // dari request (string ObjectId)
        : findMovie.genre?._id?.toString(), // fallback hanya ObjectId
      theaters: req.body.theaters
        ? req.body.theaters.split(",")
        : findMovie.theaters.map((t: any) => t._id?.toString()),
      available: req.body.available,
      description: req.body.description,
      price: req.body.price ? Number(req.body.price) : findMovie.price,
      bonus: req.body.bonus,
    });

    if (!parseData.success) {
      const errorMessages = parseData.error.issues
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        message: "Invalid Request Data",
        detail: errorMessages,
        status: "Failed",
      });
    }

    const uploadFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const files = uploadFiles;

    if (files?.thumbnail) {
      // delete old thumbnail image from public folder
      const dirname = path.resolve(); // get current directory path project
      const filePath = path.join(
        dirname,
        "public/images/thumbnails",
        findMovie.thumbnail ?? ""
      ); // construct full path to the file
      // jika ada file dengan path tersebut maka dihapus
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (files?.video_trailer) {
      // delete old thumbnail image from public folder
      const dirname = path.resolve(); // get current directory path project
      const filePath = path.join(
        dirname,
        "public/videos/trailers",
        findMovie.video_trailer ?? ""
      ); // construct full path to the file
      // jika ada file dengan path tersebut maka dihapus
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await GenreModel.findByIdAndUpdate(findMovie.genre, {
      $pull: { movies: findMovie._id },
    });

    for (const theater of findMovie.theaters) {
      await TheaterModel.findByIdAndUpdate(theater, {
        $pull: { movies: findMovie._id },
      });
    }

    const updatedMovie = await movieService.updateData(slug, {
      ...parseData.data,
      thumbnail: files?.thumbnail
        ? files.thumbnail[0].filename
        : findMovie.thumbnail,
      video_trailer: files?.video_trailer
        ? files.video_trailer[0].filename
        : findMovie.video_trailer,
    });

    await GenreModel.findByIdAndUpdate(updatedMovie?.genre, {
      $push: { movies: updatedMovie?._id },
    });

    for (const theater of updatedMovie?.theaters || []) {
      await TheaterModel.findByIdAndUpdate(theater, {
        $push: { movies: updatedMovie?._id },
      });
    }

    return res.status(200).json({
      message: "Success Update Data Movies",
      data: updatedMovie,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Update Data Movies",
      status: 500,
      data: err,
    });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const findMovie = await movieService.findDetailData(slug);

  if (!findMovie) {
    return res.status(404).json({
      message: "Data Movie not found",
      status: 404,
      data: null,
    });
  }

  try {
    const deletedMovie = await movieService.deleteData(slug);
    if (deletedMovie) {
      // delete old thumbnail image from public folder
      const dirname = path.resolve(); // get current directory path project
      const filePath = path.join(
        dirname,
        "public/images/thumbnails",
        findMovie.thumbnail ?? ""
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await GenreModel.findByIdAndUpdate(findMovie.genre, {
      $pull: { movies: findMovie._id },
    });

    for (const theater of findMovie.theaters) {
      await TheaterModel.findByIdAndUpdate(theater, {
        $pull: { movies: findMovie._id },
      });
    }

    return res.status(200).json({
      message: "Success Delete Data Movies",
      data: findMovie,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Delete Data Movies",
      status: 500,
      data: err,
    });
  }
};

export const getDetailMovie = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  try {
    const findMovie = await movieService.findDetailData(slug);
    if (!findMovie) {
      return res.status(404).json({
        message: "Data Movie not found",
        status: 404,
        data: null,
      });
    }
    return res.status(200).json({
      message: "Success Get Detail Data Movies",
      data: findMovie,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Detail Data Movies",
      status: 500,
      data: err,
    });
  }
};

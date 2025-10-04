import type { Request, Response } from "express";
import GenreModel from "../models/GenreModel";
import { GenreRepositories } from "../repositories/GenreRepositories";
import { GenreServices } from "../service/GenreServices";
import { genreSchema, genreUpdateSchema } from "../utils/zodSchema";

// not service and repository patern
// const getGenres = async (req: Request, res: Response) => {
//   try {
// tampilkan semua data genre dari database
//     const genres = await GenreModel.find();
//     if (genres.length <= 0) {
//       return res.json({
//         data: genres,
//         message: "Success But Data is Null",
//         status: 200,
//       });
//     }
//     return res.json({
//       data: genres,
//       message: "Success Get Data Genres",
//       status: 200,
//     });
//   } catch (error) {
//     return res.json({
//       message: "Failed Get Data Genres",
//       status: 500,
//       data: error,
//     });
//   }
// };
const genreRepo = new GenreRepositories();
const genreService = new GenreServices(genreRepo);

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await genreService.findAllData();
    if (genres.length === 0)
      return res.json({
        data: [],
        message: "Success But No Data Found",
        status: 200,
      });

    return res.status(200).json({
      data: genres,
      message: "Success Get Data Genres",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Data Genres",
      status: 500,
      data: err,
    });
  }
};

export const postGenre = async (req: Request, res: Response) => {
  try {
    const parseData = genreSchema.safeParse(req.body);

    if (!parseData.success) {
      return res.status(400).json({
        message: "Invalid Request Data",
        detail: parseData.error.format(),
        status: "Failed",
      });
    }

    const newGenre = await genreService.postData({
      name: parseData.data.name,
    });

    return res.status(200).json({
      message: "Success Post Data Genre",
      data: newGenre,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Post Data Genre",
      status: 500,
      data: err,
    });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const body = genreUpdateSchema.parse(req.body);
  const findDataGenre = await genreService.findDetailData(slug);

  try {
    if (slug !== findDataGenre?.slug) {
      return res.json({
        message: "Data Not Found",
        status: 404,
        data: null,
      });
    }
    const updateData = await genreService.updateData(slug, body);

    return res.status(200).json({
      data: updateData,
      message: "Success Update Data Genres",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Update Data Genres",
      status: 500,
      data: err,
    });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  try {
    const getDeletedData = await GenreModel.findOne({ slug });
    await genreService.deleteData(slug);

    return res.json({
      data: getDeletedData,
      message: "Success Delete Data Genre",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Delete Data Genre",
      status: 500,
      data: err,
    });
  }
};

export const getDetailGenre = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  try {
    const getDetailGenre = await genreService.findDetailData(slug);

    if (!getDetailGenre) {
      return res.json({
        message: "Data Not Found",
        status: 404,
        data: null,
      });
    }

    return res.json({
      data: getDetailGenre,
      message: "Success Get Detail Genre",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Detail Genre",
      status: 500,
      data: err,
    });
  }
};

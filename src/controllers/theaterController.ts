import { Request, Response } from "express";
import { TheaterServices } from "../service/TheaterServices";
import { TheaterRepositories } from "../repositories/TheaterRepositories";
import { theaterSchema, theaterUpdateSchema } from "../utils/zodSchema";

const theaterRepos = new TheaterRepositories();
const theaterServices = new TheaterServices(theaterRepos);

export const getAllTheater = async (req: Request, res: Response) => {
  try {
    const theaters = await theaterServices.getAllData();

    if (theaters.length === 0) {
      return res.json({
        data: [],
        message: "Success But No Data Found",
        status: 200,
      });
    }

    return res.status(200).json({
      data: theaters,
      message: "Success Get Data Theater",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Data Theater",
      status: 500,
      data: err,
    });
  }
};

export const postDataTheater = async (req: Request, res: Response) => {
  try {
    const body = theaterSchema.parse(req.body);
    const newData = await theaterServices.postData(body);

    return res.status(200).json({
      data: newData,
      message: "Success Post Data Theater",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Post Data Theater",
      status: 500,
      data: err,
    });
  }
};

export const updateDataTheater = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const bodyData = theaterUpdateSchema.parse(req.body);

  const findDataTheater = await theaterServices.findDetailData(slug);

  if (slug !== findDataTheater?.slug) {
    return res.json({
      message: "Data Not Found",
      status: 404,
      data: null,
    });
  }

  try {
    const updatedData = await theaterServices.updateData(slug, bodyData);

    return res.json({
      data: updatedData,
      message: "Success Update Data Theater",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Update Data Theater",
      status: 500,
      data: err,
    });
  }
};

export const deleteDataTheater = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const findDataTheater = await theaterServices.findDetailData(slug);

  if (slug !== findDataTheater?.slug) {
    return res.json({
      message: "Data Not Found",
      status: 404,
      data: null,
    });
  }

  try {
    await theaterServices.deleteData(slug);

    return res.json({
      data: findDataTheater,
      message: "Success Delete Data Theater",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Delete Data Theater",
      status: 500,
      data: err,
    });
  }
};

export const getDetailTheater = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const findDataTheater = await theaterServices.findDetailData(slug);

  if (slug !== findDataTheater?.slug) {
    return res.json({
      message: "Data Not Found",
      status: 404,
      data: null,
    });
  }

  try {
    const getDetailTheater = await theaterServices.findDetailData(slug);

    if (!getDetailTheater) {
      return res.json({
        message: "Data Not Found",
        status: 404,
        data: null,
      });
    }

    return res.json({
      data: getDetailTheater,
      message: "Success Get Detail Theater",
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed Get Detail Theater",
      status: 500,
      data: err,
    });
  }
};

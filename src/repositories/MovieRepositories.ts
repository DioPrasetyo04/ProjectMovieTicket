import { Movie } from "../fitur_interfaces/InterfaceMovie";
import { IMovieRepositories } from "../interfaces/IMovieRepositories";
import GenreModel from "../models/GenreModel";
import MovieModel from "../models/MovieModel";
import TheaterModel from "../models/TheaterModel";

export class MovieRepositories implements IMovieRepositories {
  async findAllData(): Promise<Movie[] | null> {
    const movies = await MovieModel.find()
      .populate({
        path: "genre",
        model: GenreModel,
        select: "name slug",
      })
      .populate({
        path: "theaters",
        model: TheaterModel,
        select: "name city slug",
      });
    // lean menjadikan data yang diambil dari database menjadi plain object atau json object bukan mongoose object yang ada method save, update, delete, virtuals, dll
    // .lean({ virtuals: true });

    return movies;
  }

  async postData(data: Movie): Promise<Movie> {
    const newMovie = new MovieModel(data);
    return await newMovie.save();
  }

  async findDetailData(slug: string): Promise<Movie | null> {
    const findMovie = await MovieModel.findOne({ slug })
      .populate({
        path: "genre",
        model: GenreModel,
        select: "name slug",
      })
      .populate({
        path: "theaters",
        model: TheaterModel,
        select: "name city slug",
      });

    return findMovie;
  }

  async updateData(slug: string, data: Partial<Movie>): Promise<Movie | null> {
    const updatedMovie = await MovieModel.findOneAndUpdate({ slug }, data, {
      new: true,
    });

    return updatedMovie;
  }

  async deleteData(slug: string): Promise<boolean | null> {
    return !!(await MovieModel.findOneAndDelete({ slug }));
  }
}

import { Genre } from "../fitur_interfaces/InterfaceGenre";
import { Movie } from "../fitur_interfaces/InterfaceMovie";
import { IHomeRepositories } from "../interfaces/IHomeRepositories";
import GenreModel from "../models/GenreModel";
import MovieModel from "../models/MovieModel";

export class HomeRepositories implements IHomeRepositories {
  async findAllDataMovies(): Promise<Movie[]> {
    const getAllMovies = await MovieModel.find()
      .select("title slug thumbnail")
      .populate({
        path: "genre",
        model: "Genre",
        select: "id name slug",
      });
    return getAllMovies;
  }

  async find3DataMovies(): Promise<Movie[] | null> {
    // limit 3 desc
    const get3Movies = await MovieModel.find()
      .limit(3)
      .sort({
        // by descencding created At -1
        createdAt: -1,
      })
      .select("title slug thumbnail")
      .populate({
        path: "genre",
        model: "Genre",
        select: "id name slug",
      });
    return get3Movies;
  }

  async findDetailDataMovie(slug: string): Promise<Movie | null> {
    const getDetailMovie = await MovieModel.findOne({ slug })
      .populate({
        path: "genre",
        model: "Genre",
        select: "id name slug",
      })
      .populate({
        path: "theaters",
        model: "Theater",
        select: "name city slug",
      });
    return getDetailMovie;
  }

  async findAllDataGenres(): Promise<Genre[] | null> {
    const getAllGenres = await GenreModel.find()
      .sort({ createdAt: -1 })
      .select("name slug");
    return getAllGenres;
  }

  async find3DataGenres(): Promise<Genre[] | null> {
    const get3Genres = await GenreModel.find().limit(3).select("name slug");
    return get3Genres;
  }
}

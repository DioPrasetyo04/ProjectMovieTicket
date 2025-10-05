import { Genre } from "../fitur_interfaces/InterfaceGenre";
import { Movie } from "../fitur_interfaces/InterfaceMovie";

export interface IHomeRepositories {
  findAllDataMovies(): Promise<Movie[] | null>;
  find3DataMovies(): Promise<Movie[] | null>;
  findDetailDataMovie(slug: string): Promise<Movie | null>;
  findAllDataGenres(): Promise<Genre[] | null>;
  find3DataGenres(): Promise<Genre[] | null>;
}

import { Movie } from "../fitur_interfaces/InterfaceMovie";

export interface IMovieRepositories {
  findAllData(): Promise<Movie[] | null>;
  postData(data: Movie): Promise<Movie>;
  updateData(slug: string, data: Partial<Movie>): Promise<Movie | null>;
  deleteData(slug: string): Promise<boolean | null>;
  findDetailData(slug: string): Promise<Movie | null>;
}

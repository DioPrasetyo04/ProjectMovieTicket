import { IHomeRepositories } from "../interfaces/IHomeRepositories";

export class HomeServices {
  protected homeServices: any;

  constructor(private homeRepositories: IHomeRepositories) {
    this.homeServices = homeRepositories;
  }

  async findAllDataMovies() {
    return await this.homeServices.findAllDataMovies();
  }

  async find3DataMovies() {
    return await this.homeServices.find3DataMovies();
  }

  async findDetailDataMovie(slug: string) {
    return await this.homeServices.findDetailDataMovie(slug);
  }

  async findAllDataGenres() {
    return await this.homeServices.findAllDataGenres();
  }

  async find3DataGenres() {
    return await this.homeServices.find3DataGenres();
  }
}

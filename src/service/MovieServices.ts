import { Movie } from "../fitur_interfaces/InterfaceMovie";
import { IMovieRepositories } from "../interfaces/IMovieRepositories";

export class MovieServices {
  private movieServices: any;
  constructor(private movieRepositories: IMovieRepositories) {
    this.movieServices = movieRepositories;
  }

  async findAllData() {
    return await this.movieServices.findAllData();
  }

  async postData(data: Movie) {
    const slug = data.title.toLowerCase().replace(/\s/g, "-");
    data.slug = slug;
    return await this.movieServices.postData({ ...data, slug });
  }

  async findDetailData(slug: string) {
    return await this.movieServices.findDetailData(slug);
  }

  async updateData(slug: string, data: Partial<any>) {
    if (data.title) {
      const newSlug = data.title.toLowerCase().replace(/\s/g, "-");
      data.slug = newSlug;
      return await this.movieServices.updateData(slug, {
        ...data,
        slug: newSlug,
      });
    }

    return await this.movieServices.updateData(slug, data);
  }

  async deleteData(slug: string) {
    return await this.movieServices.deleteData(slug);
  }
}

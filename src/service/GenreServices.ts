import { IGenreRepositories } from "../interfaces/IGenreRepositories";

export class GenreServices {
  protected genreServices: any;
  constructor(private genreRepositories: IGenreRepositories) {
    this.genreServices = genreRepositories;
  }

  async findAllData() {
    return await this.genreServices.findAllData();
  }

  async postData(data: { name: string }) {
    // ambil data name dari post data yang di submit oleh user
    const { name } = data;
    // buat data slug
    const slug = name.toLowerCase().replace(/\s/g, "-");
    return await this.genreServices.postData({ name, slug });
  }

  async updateData(slug: string, data: { name?: string; slug?: string }) {
    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/\s/g, "-");
    }
    return await this.genreServices.updateData(slug, data);
  }

  async deleteData(slug: string) {
    return await this.genreServices.deleteData(slug);
  }

  async findDetailData(slug: string) {
    return await this.genreServices.findDetailData(slug);
  }
}

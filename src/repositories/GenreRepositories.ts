import { Genre } from "../fitur_interfaces/InterfaceGenre";
import type { IGenreRepositories } from "../interfaces/IGenreRepositories";
import GenreModel from "../models/GenreModel";

export class GenreRepositories implements IGenreRepositories {
  async findAllData(): Promise<Genre[]> {
    // find untuk get atau menampilkan data dalam mongo db
    return await GenreModel.find();
  }
  async postData(data: Genre): Promise<Genre> {
    // create untuk insert data dalam mongo db
    const genre = await GenreModel.create(data);
    return genre.save();
  }

  async updateData(slug: string, data: Partial<Genre>): Promise<Genre | null> {
    return await GenreModel.findOneAndUpdate({ slug }, data, { new: true });
  }

  async deleteData(slug: string): Promise<boolean | null> {
    return !!(await GenreModel.findOneAndDelete({ slug }));
  }

  async findDetailData(slug: string): Promise<Genre | null> {
    return await GenreModel.findOne({ slug });
  }
}

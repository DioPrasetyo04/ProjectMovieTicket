import { Theater } from "../fitur_interfaces/InterfaceTheater";
import ITheaterRepositories from "../interfaces/ITheaterRepositories";
import TheaterModel from "../models/TheaterModel";
export class TheaterRepositories implements ITheaterRepositories {
  async getAllData(): Promise<Theater[]> {
    return await TheaterModel.find();
  }

  async findDetailData(slug: string): Promise<Theater | null> {
    return await TheaterModel.findOne({ slug });
  }

  async postData(data: Theater): Promise<Theater> {
    const createData = await TheaterModel.create(data);
    return createData.save();
  }

  async updateData(
    slug: String,
    data: Partial<Theater>
  ): Promise<Theater | null> {
    return await TheaterModel.findOneAndUpdate({ slug }, data, { new: true });
  }

  async deleteData(slug: string): Promise<boolean> {
    return !!(await TheaterModel.findOneAndDelete({ slug }));
  }
}

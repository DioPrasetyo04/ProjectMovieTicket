import { Theater } from "../fitur_interfaces/InterfaceTheater";
import ITheaterRepositories from "../interfaces/ITheaterRepositories";
import TheaterModel from "../models/TheaterModel";

export class TheaterServices {
  private theaterServices: any;
  constructor(private ITheaterRepositories: ITheaterRepositories) {
    this.theaterServices = ITheaterRepositories;
  }

  async getAllData() {
    return await this.theaterServices.getAllData();
  }

  async findDetailData(slug: string) {
    return await this.theaterServices.findDetailData(slug);
  }

  async postData(data: Theater) {
    const { name, city } = data;

    if (name && city) {
      const slug = name.toLowerCase().replace(/\s/g, "-");
      return await this.theaterServices.postData({ ...data, slug });
    } else {
      throw new Error("Name and City is required");
    }

    // const { name, city } = data;
    // if (!name) {
    //   throw new Error("Name is required");
    // }
    // if (!city) {
    //   throw new Error("City is required");
    // }
    // if (name && city) {
    //   const slug = name.toLowerCase().replace(/\s/g, "-");
    //   const theater = new TheaterModel({
    //     name,
    //     city,
    //     slug,
    //   });
    //   return await theater.save();
    // }
  }

  async updateData(slug: string, data: Theater) {
    const findData = await this.theaterServices.findDetailData(slug);

    if (!findData) {
      throw new Error("Data Not Found");
    }

    // initialitation slug data lama
    let newSlug = findData.slug;

    if (data.name && data.name !== findData.name) {
      newSlug = data.name.toLowerCase().replace(/\s/g, "-");
    }

    return await this.theaterServices.updateData(slug, {
      ...data,
      slug: newSlug,
    });
  }

  async deleteData(slug: string) {
    return await this.theaterServices.deleteData(slug);
  }
}

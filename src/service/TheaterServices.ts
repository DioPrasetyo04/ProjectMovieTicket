import { Theater } from "../fitur_interfaces/InterfaceTheater";
import ITheaterRepositories from "../interfaces/ITheaterRepositories";
import TheaterModel from "../models/TheaterModel";
import { seatGenerator } from "../utils/merge";

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
    const { name, layout } = data;

    if (!name) {
      throw new Error("Name is required");
    }

    if (!layout?.total_rows && !layout?.seat_per_row) {
      throw new Error(
        "Layout configuration total_rows and seat_per_row is required"
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const generatedLayout = seatGenerator.generateSeatLayout(
      layout.total_rows!,
      layout.seat_per_row!
    );

    const theaterData: Theater = {
      ...data,
      slug,
      layout: generatedLayout,
    };

    return await this.theaterServices.postData(theaterData);
  }

  async updateData(slug: string, data: Partial<Theater>) {
    const findData = await this.theaterServices.findDetailData(slug);

    if (!findData) {
      throw new Error("Data Not Found");
    }

    // initialitation slug data lama
    let newSlug = findData.slug;

    if (data.name && data.name !== findData.name) {
      newSlug = data.name
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    // generate layout jika ada data baru
    let updatedLayout = data.layout;
    if (
      data.layout &&
      (data.layout.total_rows !== findData.layout?.total_rows ||
        data.layout.seat_per_row !== findData.layout?.seat_per_row)
    ) {
      updatedLayout = seatGenerator.generateSeatLayout(
        data.layout.total_rows!,
        data.layout.seat_per_row!
      );
    }

    return await this.theaterServices.updateData(slug, {
      ...data,
      slug: newSlug,
      layout: updatedLayout,
    });
  }

  async deleteData(slug: string) {
    return await this.theaterServices.deleteData(slug);
  }
}

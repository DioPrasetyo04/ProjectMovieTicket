import { Theater } from "../fitur_interfaces/InterfaceTheater";

interface ITheaterRepositories {
  getAllData(): Promise<Theater[]>;
  findDetailData(slug: string): Promise<Theater | null>;
  postData(data: Theater): Promise<Theater>;
  updateData(slug: string, data: Partial<Theater>): Promise<Theater | null>;
  deleteData(slug: string): Promise<boolean | null>;
}

export default ITheaterRepositories;

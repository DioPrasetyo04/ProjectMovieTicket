import { Genre } from "../fitur_interfaces/InterfaceGenre";

export interface IGenreRepositories {
  // promise digunakan agar proses async dapat digunakan dengan baik untuk proses await atau fetching data dari database
  findAllData(): Promise<Genre[] | null>;
  postData(data: Genre): Promise<Genre>;
  // partial karena yang diubah datanya hanya beberapa saja tidak semua full  diubah
  updateData(slug: string, data: Partial<Genre>): Promise<Genre | null>;
  deleteData(slug: string): Promise<boolean | null>;
  findDetailData(slug: string): Promise<Genre | null>;
}

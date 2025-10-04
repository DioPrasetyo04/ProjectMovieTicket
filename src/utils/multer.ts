import multer, { FileFilterCallback, Multer, StorageEngine } from "multer";
import { Request } from "express";
import { allowedFileTypes } from "./merge";

// function storages untuk foto dan thumbnail
export const thumbnailStorage = (
  path = "public/images/thumbnails"
): StorageEngine => {
  // menggunakan multer diskstorage yang di install melalui npm i multer
  return multer.diskStorage({
    // destination file penyimpanan
    destination: (req, file, cb) => {
      // callback file path
      cb(null, path);
    },
    // nama file yang disimpan
    filename: (req, file, cb) => {
      // membuat nama file yang unik dengan menamahkan tahun, bulan, tanggal sekarang now
      const date = new Date();
      // formatted date
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      // membuat unique suffix dengan menambahkan random number
      const uniqueSuffix = `${formattedDate}-${Math.round(
        Math.random() * 1e9
      )}`;

      // membuat nama file dengan format fieldname-originalname-uniqueSuffix.extension
      // contoh: thumbnail-myphoto-2023-09-15-123456789.jpg
      const fileName = `${file.fieldname}-${uniqueSuffix}.${
        file.mimetype.split("/")[1]
      }`;

      // callback fileName
      cb(null, fileName);
    },
  });
};

// function filter image
export const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // validate file types
  if (!allowedFileTypes.includes(file.mimetype)) {
    // jika reject file tidak di simpan null error dan false
    return cb(null, false);
  }

  // tidak ada error dan simpan atau step selanjutnya
  cb(null, true);
};

export const photoStorage = (path = "public/images/photos"): StorageEngine => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const date = new Date();

      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const uniqueSuffix = `${formattedDate}-${Math.round(
        Math.random() * 1e9
      )}`;

      const fileName = `${file.fieldname}-${uniqueSuffix}.${
        file.mimetype.split("/")[1]
      }`;

      cb(null, fileName);
    },
  });
};

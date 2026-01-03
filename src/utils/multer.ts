import multer, { StorageEngine } from "multer";
import { Request } from "express";
import path from "node:path";
import fs from "node:fs";
import { allowedFileTypesPhoto, allowedFileTypesVideo } from "./merge";

// function storages untuk foto dan thumbnail
export const dynamicStorage = (): StorageEngine => {
  // menggunakan multer diskstorage yang di install melalui npm i multer
  return multer.diskStorage({
    // destination file penyimpanan
    destination: (req, file, cb) => {
      let uploadPath;

      if (file.fieldname === "thumbnail") {
        uploadPath = path.join("public", "images", "thumbnails");
      } else if (file.fieldname === "video_trailer") {
        uploadPath = path.join("public", "videos", "trailers");
      } else if (file.fieldname === "photo") {
        uploadPath = path.join("public", "images", "photos");
      } else {
        // callback error must provide a string path as second arg per types
        return cb(
          new Error("Invalid fieldname, must be thumbnail or video_trailer"),
          ""
        );
      }

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // provide destination path
      cb(null, uploadPath);
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

      const fileType = file.mimetype.split("/")[1];

      // membuat nama file dengan format fieldname-originalname-uniqueSuffix.extension
      // contoh: thumbnail-myphoto-2023-09-15-123456789.jpg
      const fileName = `${file.fieldname}-${uniqueSuffix}.${fileType}`;

      // callback fileName
      cb(null, fileName);
    },
  });
};

// function filter image
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: any
) => {
  // if (file.fieldname === "thumbnail" && !file.mimetype.startsWith("image/")) {
  //   return cb(new Error("Invalid thumbnail file type"), false);
  // }
  // if (
  //   file.fieldname === "video_trailer" &&
  //   !file.mimetype.startsWith("video/")
  // ) {
  //   return cb(new Error("Invalid video file type"), false);
  // }
  if (
    file.fieldname === "thumbnail" &&
    !allowedFileTypesPhoto.includes(file.mimetype.split("/")[1])
  ) {
    return cb(new Error("Invalid thumbnail file type"), false);
  }

  if (
    file.fieldname === "video_trailer" &&
    !allowedFileTypesVideo.includes(file.mimetype.split("/")[1])
  ) {
    return cb(new Error("Invalid video file type"), false);
  }

  if (
    file.fieldname === "photo" &&
    !allowedFileTypesPhoto.includes(file.mimetype.split("/")[1])
  ) {
    return cb(new Error("Invalid photo file type"), false);
  }

  cb(null, true);
};

export const uploadDynamic = multer({
  storage: dynamicStorage(),
  fileFilter,
});

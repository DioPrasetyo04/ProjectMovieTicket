import mongoose from "mongoose";

const database = () => {
  const DB_URL = process.env.DB_URL;
  const DB_NAME = process.env.DB_NAME;

  // menghubungkan mongo databases dengan project local dengan sintaks connect dan url yang diimport dari env dengan dotenv
  try {
    mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  // mengambil nilai koneksi atau hasil koneksi dari mongo db
  const dbConn = mongoose.connection;
  // console.log(dbConn);

  dbConn.on("open", (_) => {
    console.log("Database connected");
  });

  dbConn.on("close", (_) => {
    console.log("Database disconnected");
  });

  dbConn.on("error", (error) => {
    console.log(`Database Connect Error: ${error}`);
    process.exit(1);
  });
};

export default database;

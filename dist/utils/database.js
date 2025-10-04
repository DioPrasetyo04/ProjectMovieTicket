"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database = () => {
    const DB_URL = process.env.DB_URL;
    const DB_NAME = process.env.DB_NAME;
    // menghubungkan mongo databases dengan project local dengan sintaks connect dan url yang diimport dari env dengan dotenv
    try {
        mongoose_1.default.connect(`mongodb://${DB_URL}/${DB_NAME}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
    // mengambil nilai koneksi atau hasil koneksi dari mongo db
    const dbConn = mongoose_1.default.connection;
    // console.log(dbConn);
    dbConn.on("open", (_) => {
        console.log("Database connected");
    });
    dbConn.on("error", (error) => {
        console.log(`Database Connect Error: ${error}`);
        process.exit(1);
    });
};
exports.default = database;
//# sourceMappingURL=database.js.map
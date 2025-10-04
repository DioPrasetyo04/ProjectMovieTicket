"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./utils/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";
(0, database_1.default)();
app.get("/", (req, res) => {
    res.send("Hello World from Express With Typescript!");
});
app.listen(port, () => {
    console.log(`App run listening at http://${host}:${port}`);
});
//# sourceMappingURL=index.js.map
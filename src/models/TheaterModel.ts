import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      // tidak required ketika update
    },
    slug: {
      type: String,
      unique: true,
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Theater", theaterSchema, "theaters");

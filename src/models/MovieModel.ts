import mongoose, { model } from "mongoose";
import GenreModel from "./GenreModel";
import TheaterModel from "./TheaterModel";
import { Movie } from "../fitur_interfaces/InterfaceMovie";
import { getPublicThumbnailUrl, getVideoTrailerUrl } from "../utils/helper";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Genre",
      ref: "Genre",
      required: true,
    },
    theaters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        model: "Theater",
        ref: "Theater",
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    video_trailer: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    bonus: {
      type: String,
      required: true,
    },
  },
  // virtual untuk gambar dan video yang akan disimpan oleh express kedalam asset url project
  {
    virtuals: {
      // virtual field thumbnail
      // field thumbnailUrl
      thumbnailUrl: {
        // get data json untuk di fetching
        get() {
          // return public photoUrl project file
          return `${getPublicThumbnailUrl("thumbnails")}${this.thumbnail}`;
        },
      },
      videoUrl: {
        get() {
          return `${getVideoTrailerUrl("trailers")}${this.video_trailer}`;
        },
      },
    },
    // to json virtual field
    toJSON: {
      virtuals: true,
    },
  }
);

// proses foreign key ke genre dan theater
// jika ada interaksi post dan saving data movie
movieSchema.post("save", async (doc) => {
  // jika ada datanya
  if (doc) {
    // temukan genre record atau body berdasarkan field genre yang dikirim movie
    await GenreModel.findByIdAndUpdate(doc.genre, {
      // push data movie id sesuai dengan record genre
      $push: {
        movies: doc._id,
      },
    });

    // lakukan perulangan untuk theater yang dikirim
    for (const theater of doc.theaters) {
      // temukan theater record atau body theater berdasarkan id theater yang dikirim dari data movie dan update field theater
      await TheaterModel.findByIdAndUpdate(theater, {
        // push data movie dengan field theaters sesuai dengan record theater
        $push: {
          movies: doc._id,
        },
      });
    }
  }
});

movieSchema.post("deleteOne", async (doc) => {
  if (doc) {
    await GenreModel.findByIdAndUpdate(doc.genre, {
      $pull: {
        movies: doc._id,
      },
    });

    for (const theater of doc.theaters) {
      await TheaterModel.findByIdAndUpdate(theater, {
        $pull: {
          movies: theater._id,
        },
      });
    }
  }
});

export default mongoose.model<Movie & mongoose.Document>(
  "Movie",
  movieSchema,
  "movies"
);

import mongoose from "mongoose";

// not exported hanya arsitektur mvc saja not repository interface patern
// const genreSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Genre", genreSchema);

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    // karena satu genre bisa banyak movie maka bentuknya adalah array dan didalam array ada object object movienya atau atribut atribut movienya
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        model: "Movie",
      },
    ],
  },
  { timestamps: true }
);

// menggunakan model untuk meregenerate slug sebelum disimpan
// genreSchema.pre("save", function (next) {
//   if (this.isModified("name")) {
//     this.slug = this.name.toLowerCase().replace(/\s/g, "-");
//   }
//   next();
// });

export default mongoose.model("Genre", genreSchema, "genres");

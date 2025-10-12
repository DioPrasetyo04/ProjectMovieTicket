import mongoose from "mongoose";
import { Theater } from "../fitur_interfaces/InterfaceTheater";

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    city: {
      type: String,
      required: true,
      // tidak required ketika update
    },
    address: {
      type: String,
      required: true,
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
      },
    ],
    layout: {
      total_rows: {
        type: Number,
        required: true,
        min: [1, "Total rows must be at least 1"],
      },
      seat_per_row: {
        type: Number,
        required: true,
        min: [1, "Seat per row must be at least 1"],
      },
      seats: [
        {
          seat_number: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            required: true,
            enum: ["available", "booked", "not-available"],
            default: "available",
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

theaterSchema.virtual("total_seats").get(function () {
  if (this.layout?.total_rows && this.layout?.seat_per_row) {
    return this.layout.total_rows * this.layout.seat_per_row;
  }

  return 0;
});

// otomatis update slug jika ada perubahan nama
theaterSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  next();
});

export default mongoose.model<Theater>("Theater", theaterSchema, "theaters");

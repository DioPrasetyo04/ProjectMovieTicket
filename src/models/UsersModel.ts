import mongoose from "mongoose";
import { getPublicPhotoUrl } from "../utils/helper";
import { User } from "../fitur_interfaces/InterfaceUser";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
  //   get virtual url photo field
  {
    virtuals: {
      photoUrl: {
        get() {
          return `${getPublicPhotoUrl("photos")}${this.photo}`;
        },
      },
    },
    toJSON: {
      virtuals: true,
    },
  }
);

export default mongoose.model<User>("User", userSchema, "users");

import { ObjectId } from "mongoose";

export interface Genre {
  name?: string;
  theaters?: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

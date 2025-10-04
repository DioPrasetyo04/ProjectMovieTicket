import { ObjectId } from "mongoose";

export interface Movie {
  title: string;
  // foreign key ke model dan table genre
  genre?: ObjectId;
  theaters?: ObjectId[];
  description: string;
  thumbnail: string;
  price: number;
  available: boolean;
  bonus: string;
}

import { ObjectId } from "mongoose";

export interface Movie {
  title: string;
  // foreign key ke model dan table genre
  slug?: string;
  genre?: ObjectId;
  theaters?: ObjectId[];
  description: string;
  thumbnail: string;
  video_trailer?: string;
  price: number;
  available: boolean;
  bonus: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

import { ObjectId } from "mongoose";

export interface Theater {
  name?: string;
  slug?: string;
  city?: string;
  address?: string;
  movies?: ObjectId[];
  total_rows?: number;
  seat_per_row?: number;
  layout?: {
    total_rows?: number;
    seat_per_row?: number;
    seats?: {
      seat_number: string;
      status: "available" | "booked" | "not-available";
    }[];
  };
  total_seats?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

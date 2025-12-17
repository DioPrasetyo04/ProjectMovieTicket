import z from "zod";

export const genreSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
  })
  .strict();

export const genreUpdateSchema = genreSchema.partial();

export const theaterSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    city: z.string().min(3, "City must be at least 3 characters long"),
    address: z.string().min(3, "Address must be at least 3 characters long"),
    layout: z.object({
      total_rows: z.number().min(1, "Total rows must be at least 1"),
      seat_per_row: z.number().min(1, "Seat per row must be at least 1"),
    }),
  })
  .strict();

export const theaterUpdateSchema = theaterSchema.partial();

export const movieSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  genre: z.string().min(1, "Genre is required"), // ObjectId biasanya panjang
  theaters: z
    .array(z.string().min(1))
    .min(1, "At least one theater is required"),
  available: z.coerce.boolean().optional(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  price: z.number(),
  bonus: z.string(),
});

export const movieUpdateSchema = movieSchema.partial();

export const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["admin", "customer"]).optional(),
});

export const userUpdateSchema = userSchema.partial();

export const authSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["admin", "customer"]),
});

export const topUpSchema = z.object({
  balance: z.number().min(1000, "Balance must be at least 1000"),
});

export const transactionSchema = z
  .object({
    subtotal: z.number(),
    total: z.number(),
    bookingFee: z.number(),
    tax: z.number(),
    movieId: z.string().min(1, "Movie ID is required"),
    theaterId: z.string().min(1, "Theater ID is required"),
    seats: z.array(z.string()).min(1, "At least one seat is required"),
    date: z.string(),
  })
  .strict();

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
  })
  .strict();

export const theaterUpdateSchema = theaterSchema.partial();

export const movieSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  genre: z.string().min(1, "Genre is required"), // ObjectId biasanya panjang
  theaters: z
    .array(z.string().min(1))
    .min(1, "At least one theater is required"),
  available: z.boolean(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .optional(),
  price: z.number(),
  bonus: z.string().optional(),
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

import type { Request } from "express";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
};

export interface CustomRequest extends Request {
  user?: User;
}

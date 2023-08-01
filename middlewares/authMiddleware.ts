import jwt from "jsonwebtoken";
import { RequestHandler } from "express";

const secret = process.env.JWT_SECRET || "";

interface JwtPayload {
  userId: string;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) throw new Error("No Token");
    const decryptedData = jwt.verify(token, secret) as JwtPayload;
    req.body.userId = decryptedData.userId;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

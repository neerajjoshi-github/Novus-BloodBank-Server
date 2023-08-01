import { RequestHandler } from "express";
import UserModel from "../models/userModel";
import * as bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import InventorayModel from "../models/inventoryModal";
import mongoose from "mongoose";

const secret = process.env.JWT_SECRET || "";

export const getUser: RequestHandler = async (req, res, next) => {
  const userId = req.body.userId;
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError(404, "No user found with this id!!");
  res.status(200).json({
    status: "ok",
    message: "User fetched successfully!!",
    data: user,
  });
  try {
  } catch (error) {
    console.log("Error while getting an user!!", error);
    next(error);
  }
};

export const registerUser: RequestHandler = async (req, res, next) => {
  const data = req.body;
  const { password, email } = data;
  try {
    // finding if email already exist
    const user: User | null = await UserModel.findOne({ email: email });
    if (user) throw createHttpError(409, "Email already in use!!");
    data.password = await bcrypt.hash(password, 12);
    const newUser = await UserModel.create(data);
    res.status(200).json({
      status: "ok",
      message: "Registered successfully!!",
      data: newUser,
    });
  } catch (error) {
    console.log("Error while creating a user!!", error);
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password, userType } = req.body;
  try {
    // finding user in database with email
    const user: User | null = await UserModel.findOne({ email: email });
    if (!user) throw createHttpError(400, "User does not exist!!");

    // chceck if the password match with the email
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      throw createHttpError(400, "Invaild email or password!!");

    // check if the user type match
    const userTypeMatched = userType === user.userType;
    if (!userTypeMatched)
      throw createHttpError(400, "Invaild email or password!!");

    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "1d",
    });
    res.status(200).json({
      status: "ok",
      message: "Logged in successfully!!",
      data: { token },
    });
  } catch (error) {
    console.log("Error while logging a user!!", error);
    next(error);
  }
};

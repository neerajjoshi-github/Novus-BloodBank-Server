import mongoose from "mongoose";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import InventorayModel from "../models/inventoryModal";
import UserModel from "../models/userModel";

type BloodGroupData = {
  totalIn: number;
  totalOut: number;
  available: number;
};

type BloodGroupsData = Record<string, BloodGroupData>;

export const getBloodGroupsData: RequestHandler = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const allBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodGroupsData: BloodGroupsData = {};
    const user = await UserModel.findById(userId);
    await Promise.all(
      allBloodGroups.map(async (bloodGroup) => {
        const totalInAmount = await InventorayModel.aggregate([
          {
            $match: {
              [user?.userType as string]: new mongoose.Types.ObjectId(userId),
              bloodGroup: bloodGroup,
              inventoryType: "in",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $toDouble: "$quantity" } },
            },
          },
        ]);
        const totalOutAmount = await InventorayModel.aggregate([
          {
            $match: {
              [user?.userType as string]: new mongoose.Types.ObjectId(userId),
              bloodGroup: bloodGroup,
              inventoryType: "out",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $toDouble: "$quantity" } },
            },
          },
        ]);
        const totalIn = totalInAmount[0]?.total || 0;
        const totalOut = totalOutAmount[0]?.total || 0;

        const available = totalIn - totalOut;

        bloodGroupsData[bloodGroup] = {
          totalIn,
          totalOut,
          available,
        };
      })
    );

    res.status(200).json({
      status: "ok",
      message: "Inventory found!!",
      data: bloodGroupsData,
    });
  } catch (error) {
    console.log("Error while getting inventory!!", error);
    next(error);
  }
};

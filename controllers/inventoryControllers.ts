import mongoose from "mongoose";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import InventorayModel from "../models/inventoryModal";

export const addToInventoray: RequestHandler = async (req, res, next) => {
  const { inventoryType, quantity, bloodGroup, email, organization } = req.body;

  try {
    if (!inventoryType || !quantity || !bloodGroup || !email || !organization) {
      throw createHttpError(400, "Please provide all the details!!");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw createHttpError(400, "User not found with the email!!");
    }

    // DONAR TO ORG
    if (inventoryType === "in" && user.userType === "donar") {
      if (user.bloodGroup !== bloodGroup)
        throw createHttpError(
          404,
          "Blood group does not match with the email!!"
        );

      const inventory = await InventorayModel.create({
        inventoryType,
        quantity,
        bloodGroup,
        organization,
        donar: user._id,
      });
      res.status(200).json({
        status: "ok",
        message: "Inventory added successfully!!",
        data: {},
      });
    }

    // ORG TO HOSPITAL
    if (inventoryType === "out" && user.userType === "hospital") {
      const totalInOfRequestedBloodGroup = await InventorayModel.aggregate([
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organization),
            inventoryType: "in",
            bloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: { $toDouble: "$quantity" } },
          },
        },
      ]);
      const totalIn = totalInOfRequestedBloodGroup[0]?.total || 0;
      const totalOutOfRequestedBloodGroup = await InventorayModel.aggregate([
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organization),
            inventoryType: "out",
            bloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: { $toDouble: "$quantity" } },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      const availableQuantity = totalIn - totalOut;

      if (availableQuantity < parseFloat(quantity))
        throw createHttpError(
          400,
          `Only ${availableQuantity}ml of ${bloodGroup} blood is available!!`
        );

      const inventory = await InventorayModel.create({
        inventoryType,
        quantity,
        bloodGroup,
        organization,
        hospital: user._id,
      });
      res.status(200).json({
        status: "ok",
        message: "Inventory added successfully!!",
        data: {},
      });
    }
    throw createHttpError(404, "Invalid request Check the inventory type!!");
  } catch (error) {
    console.log("Error while adding to inventory!!", error);
    next(error);
  }
};

export const getInventoryTableData: RequestHandler = async (req, res, next) => {
  const userId = req.body.userId;
  let inventory: any = [];
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError(400, "User not found!!");

    if (user.userType === "organization") {
      inventory = await InventorayModel.find({ organization: userId })
        .sort({ createdAt: -1 })
        .populate("donar")
        .populate("hospital");
    } else if (user.userType === "donar") {
      inventory = await InventorayModel.find({
        donar: userId,
        inventoryType: "in",
      })
        .sort({ createdAt: -1 })
        .populate("organization");
    } else if (user.userType === "hospital") {
      inventory = await InventorayModel.find({
        hospital: userId,
        inventoryType: "out",
      })
        .sort({ createdAt: -1 })
        .populate("organization");
    }

    res.status(200).json({
      status: "ok",
      message: "Inventory found!!",
      data: inventory,
    });
  } catch (error) {
    console.log("Error while getting inventory!!", error);
    next(error);
  }
};

export const getAllHospitalsOfOrganization: RequestHandler = async (
  req,
  res,
  next
) => {
  const organization = req.body.userId;
  try {
    const hospitalIds = await InventorayModel.distinct("hospital", {
      organization: new mongoose.Types.ObjectId(organization),
    });

    const hospitals = await UserModel.find({ _id: { $in: hospitalIds } });

    if (!hospitals) throw createHttpError(400, "No hospital found!!");
    res.status(200).json({
      status: "ok",
      message: "hospitals found!!",
      data: hospitals,
    });
  } catch (error) {
    console.log("Error while getting inventory!!", error);
    next(error);
  }
};
export const getAllDonarsOfOrganization: RequestHandler = async (
  req,
  res,
  next
) => {
  const organization = req.body.userId;
  try {
    const donarIds = await InventorayModel.distinct("donar", {
      organization: new mongoose.Types.ObjectId(organization),
    });

    const donars = await UserModel.find({ _id: { $in: donarIds } });

    if (!donars) throw createHttpError(400, "No donar found!!");
    res.status(200).json({
      status: "ok",
      message: "Donars found!!",
      data: donars,
    });
  } catch (error) {
    console.log("Error while getting donars!!", error);
    next(error);
  }
};

export const getAllOrganizationsOfHospitalOrDonar: RequestHandler = async (
  req,
  res,
  next
) => {
  const userId = req.body.userId;
  try {
    const user = await UserModel.findById(userId);

    if (user?.userType !== "donar" && user?.userType !== "hospital")
      throw createHttpError(400, "Invalid request!!");

    const organizationIds = await InventorayModel.distinct("organization", {
      [user?.userType as string]: new mongoose.Types.ObjectId(userId),
    });
    const organizations = await UserModel.find({
      _id: { $in: organizationIds },
    });

    if (!organizations) throw createHttpError(400, "No organizations found!!");
    res.status(200).json({
      status: "ok",
      message: "Donars found!!",
      data: organizations,
    });
  } catch (error) {
    console.log(
      "Error while getting organizations in getDonarInventory!!",
      error
    );
    next(error);
  }
};

export const getInventoryTableDataWithFilters: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const inventory = await InventorayModel.find(req.body.filters)
      .sort({ createdAt: -1 })
      .populate("organization");

    if (!inventory) throw createHttpError(400, "Inventory not found!!");

    res.status(200).json({
      status: "ok",
      message: "Inventory found!!",
      data: inventory,
    });
  } catch (error) {
    console.log("Error while getting inventory filters!!", error);
    next(error);
  }
};

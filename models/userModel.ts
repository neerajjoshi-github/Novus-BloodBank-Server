import { Schema, model, Document, Model } from "mongoose";

export interface User extends Document {
  userType: "donar" | "organization" | "hospital" | "admin";
  name?: string;
  organizationName?: string;
  hospitalName?: string;
  email: string;
  password: string;
  ownerName?: string;
  phone: string;
  website?: string;
  address: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
}

const userSchema = new Schema<User>(
  {
    userType: {
      type: String,
      required: true,
      enum: ["donar", "organization", "hospital", "admin"],
    },
    name: {
      type: String,
      required: function (this: User) {
        if (this.userType === "donar" || this.userType === "admin") {
          return true;
        }
        return false;
      },
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: function (this: User) {
        if (this.userType === "donar") {
          return true;
        }
        return false;
      },
    },
    organizationName: {
      type: String,
      required: function (this: User) {
        if (this.userType === "organization") {
          return true;
        }
        return false;
      },
    },
    hospitalName: {
      type: String,
      required: function (this: User) {
        if (this.userType === "hospital") {
          return true;
        }
        return false;
      },
    },
    ownerName: {
      type: String,
      required: function (this: User) {
        if (this.userType === "organization" || this.userType === "hospital") {
          return true;
        }
        return false;
      },
    },

    address: {
      type: String,
      required: function (this: User) {
        if (this.userType === "organization" || this.userType === "hospital") {
          return true;
        }
        return false;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel: Model<User> = model("User", userSchema);

export default UserModel;

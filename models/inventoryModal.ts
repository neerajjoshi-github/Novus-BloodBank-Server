import mongoose, {
  Schema,
  model,
  Document,
  Model,
  mongo,
  ObjectId,
} from "mongoose";

export interface Inventoray extends Document {
  inventoryType: "in" | "out";
  email: string;
  bloodGroup: string;
  quantity: string;
  organization: ObjectId;
  hospital?: ObjectId;
  donar?: ObjectId;
}

const inventoraySchema = new Schema<Inventoray>(
  {
    inventoryType: {
      type: String,
      required: true,
      enum: ["in", "out"],
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // if enventory type in Donar is required
    // if enventory type out Hospital is required
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function (this: Inventoray) {
        return this.inventoryType === "out";
      },
    },
    donar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function (this: Inventoray) {
        return this.inventoryType === "in";
      },
    },
    quantity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const InventorayModel: Model<Inventoray> = model("Inventory", inventoraySchema);

export default InventorayModel;

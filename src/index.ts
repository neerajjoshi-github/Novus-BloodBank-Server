import mongoose from "mongoose";
import "dotenv/config";
import app from "./app";

const connectionURL = process.env.MONGODB_CONNECTION_URL || "";
const port = process.env.port || 3000;

main().catch((err) =>
  console.log("Error occurred during connecting to database", err)
);

async function main() {
  await mongoose.connect(connectionURL);
  console.log("Database connected successfully!!");
  app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
  });
}

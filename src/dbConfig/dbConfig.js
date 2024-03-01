import mongoose from "mongoose";

let isConnected = false;

export const connect = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("====================================");
    console.log("MongoDB Already connected successfully");
    console.log("====================================");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ConvoCraft",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    const connection = mongoose.connection;
    connection.on("connection", () => {
      console.log("====================================");
      console.log("MongoDB connected successfully");
      console.log("====================================");
    });

    connection.on("error", (err) => {
      console.log("====================================");
      console.log("MongoDB connection error ", err);
      console.log("====================================");
    });
  } catch (error) {
    console.log("error in connecting db : ", error);
  }
};

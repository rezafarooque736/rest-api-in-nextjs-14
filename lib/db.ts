import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectToMongoDB = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!, {
      dbName: "reset-api-in-nextjs-14",
      bufferCommands: false,
    });
  } catch (error) {
    console.log("Error connecting to mongodb database", error);
    throw new Error("Error connecting to mongodb database");
  }
};

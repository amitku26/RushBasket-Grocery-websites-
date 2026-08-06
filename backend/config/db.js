import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://isamit124_db_user:6ztwQrD1y3oWDOwi@cluster0.4wsb6df.mongodb.net/",
    )
    .then(() => console.log("DB CONNECTED"));
};

// 6ztwQrD1y3oWDOwi
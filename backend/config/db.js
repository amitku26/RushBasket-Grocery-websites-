import mongoose from "mongoose";

// hiamit mongodb pswrd
export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://amitkumar829448_db_user:hiamit@cluster0.cmt7dvb.mongodb.net/grocery"
    )
    .then(() => console.log("DB CONNECTED"));
};

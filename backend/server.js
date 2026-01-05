import express from "express";
import cors from "cors";

import "dotenv/config";
import { connectDB } from "./config/db.js";

import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoute.js";
import itemrouter from "./routes/productRoute.js";
import authMiddleware from "./middleware/auth.js";
import cartRouter from "./routes/cartRoute.js";
import orderrouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5174",
        "http://localhost:5173",
        "https://rushbasket-grocery-websites-backend.onrender.com",
        "https://rushbasket-grocery-websites-frontend.onrender.com",
        "https://rushbasket-grocery-websites-admin.onrender.com",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(newError("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
//Routes
app.use("/api/user", userRouter);
app.use("/api/cart", authMiddleware, cartRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/items", itemrouter);
app.use("/api/orders", orderrouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

// import express from "express";
// import cors from "cors";

// import "dotenv/config";
// import { connectDB } from "./config/db.js";

// import path from "path";
// import { fileURLToPath } from "url";

// import userRouter from "./routes/userRoute.js";
// import itemrouter from "./routes/productRoute.js";
// import authMiddleware from "./middleware/auth.js";
// import cartRouter from "./routes/cartRoute.js";
// import orderrouter from "./routes/orderRoute.js";

// const app = express();
// const port = process.env.PORT || 4000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const allowedOrigins = [
//   "https://rushbasket-grocery-websites-frontend.onrender.com",
//   "https://rushbasket-grocery-websites-admin.onrender.com",
// ];

// //  CORS
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // Allow requests like POSTMAN
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//   })
// );

// //  Allow preflight OPTIONS reques
// console.log("1")
// app.options("*", cors());
// console.log("2")

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// connectDB();

// //Routes
// app.use("/api/user", userRouter);
// app.use("/api/cart", authMiddleware, cartRouter);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// app.use("/api/items", itemrouter);
// app.use("/api/orders", orderrouter);

// app.get("/", (req, res) => {
//   res.send("API WORKING");
// });

// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

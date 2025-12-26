import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "../controllers/productController.js";

const itemrouter = express.Router();

itemrouter.get("/", getProducts);

itemrouter.post(
  "/",
  upload.single("image"), // 👈 REQUIRED
  createProduct
);

itemrouter.delete("/:id", deleteProduct);

export default itemrouter;


// import express from "express";
// import upload from "../middlewares/upload.js";
// import {
//   createProduct,
//   deleteProduct,
//   getProducts,
// } from "../controllers/productController.js";

// const itemrouter = express.Router();

// // Get all products
// itemrouter.get("/", getProducts);

// // Create product with image (Cloudinary)
// itemrouter.post(
//   "/",
//   upload.single("image"), // 👈 REQUIRED
//   createProduct
// );

// // Delete product
// itemrouter.delete("/:id", deleteProduct);

// export default itemrouter;

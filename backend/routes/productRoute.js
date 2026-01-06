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
  upload.single("image"), 
  createProduct
);

itemrouter.delete("/:id", deleteProduct);

export default itemrouter;

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "../controllers/productController.js";

const itemrouter = express.Router();

/* Ensure upload folder exists */
const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(" 'uploads' folder created automatically.");
}

/* Multer Storage */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),

  filename: (_req, file, cb) => {
    // Clean filename (remove spaces)
    const cleanName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

/* File Type Filter */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG image files are allowed!"));
  }
};

/* Multer Upload Handler */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

/* Product Routes */
itemrouter.get("/", getProducts);

itemrouter.post("/", upload.single("image"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Image is required (JPG / PNG only).",
    });
  }
  next();
}, createProduct);

itemrouter.delete("/:id", deleteProduct);

export default itemrouter;

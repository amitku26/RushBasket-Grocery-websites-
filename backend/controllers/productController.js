import { Product } from "../models/productModel.js";

// Get Products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Create Product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, oldPrice, price } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const filename = req.file?.filename ?? null;
    const imageUrl = filename ? `/uploads/${filename}` : null;

    const product = await Product.create({
      name,
      description,
      category,
      oldPrice: Number(oldPrice) || 0,
      price: Number(price),
      imageUrl,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Delete Product
export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};

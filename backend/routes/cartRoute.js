import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

//  protect all cart routes
cartRouter.use(authMiddleware);

//  GET all items in cart
cartRouter.get("/", getCart);

//  Add item to cart
cartRouter.post("/", addToCart);

//  Clear entire cart (placed BEFORE param route)
cartRouter.post("/clear", clearCart);

//  Update item quantity
cartRouter.put("/:id", updateCartItem);

//  Delete item from cart
cartRouter.delete("/:id", deleteCartItem);

export default cartRouter;

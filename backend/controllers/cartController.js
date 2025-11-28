import { CartItem } from "../models/cartModel.js";
import createError from "http-errors";

//  Get all cart items
export const getCart = async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );

    const formatted = items.map((ci) => ({
      _id: ci._id.toString(),
      product: ci.product,
      quantity: ci.quantity,
    }));

    res.json({ items: formatted });
  } catch (error) {
    next(error);
  }
};

//  Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      throw createError(400, "Product ID required");
    }

    let cartItem = await CartItem.findOne({
      user: req.user._id,
      product: productId,
    });

    if (cartItem) {
      cartItem.quantity += quantity;

      if (cartItem.quantity < 1) {
        await cartItem.deleteOne();
        return res.json({
          message: "Item removed",
          _id: cartItem._id.toString(),
        });
      }

      await cartItem.save();
      await cartItem.populate("product");

      return res.json({
        _id: cartItem._id.toString(),
        product: cartItem.product,
        quantity: cartItem.quantity,
      });
    }

    //  create new cart item
    cartItem = await CartItem.create({
      user: req.user._id,
      product: productId,
      quantity,
    });

    await cartItem.populate("product");

    return res.status(201).json({
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
    });
  } catch (error) {
    next(error);
  }
};

// Update item quantity
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cartItem) throw createError(404, "Cart item not found");

    cartItem.quantity = Math.max(1, quantity);
    await cartItem.save();
    await cartItem.populate("product");

    res.json({
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
    });
  } catch (error) {
    next(error);
  }
};

//  Delete item from cart
export const deleteCartItem = async (req, res, next) => {
  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cartItem) throw createError(404, "Cart item not found");

    await cartItem.deleteOne();
    res.json({ message: "Item deleted", _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

//  Clear whole cart
export const clearCart = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};

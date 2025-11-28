import express from 'express'
import authMiddleware from "../middleware/auth.js";
import { confirmPayment, createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from "../controllers/orderController.js";


const orderrouter = express.Router();

// Protected Routes
orderrouter.post('/', authMiddleware, createOrder)
orderrouter.get('/confirm', authMiddleware, confirmPayment);

//Public Routes
orderrouter.get('/', getOrders);
orderrouter.get('/:id', getOrderById);
orderrouter.put('/:id', updateOrder);
orderrouter.delete('/:id', deleteOrder);

export default orderrouter
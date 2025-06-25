import express, { Router } from 'express';
import { getAllOrders, createOrder } from '../controllers/ordersController';

const router: Router = express.Router();

router.get('/', getAllOrders);
router.post('/', createOrder);

export default router;
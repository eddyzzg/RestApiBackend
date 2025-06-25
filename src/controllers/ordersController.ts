import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/ordersModel';
import { fetchAllOrders, createOrder as create } from '../services/orderService';

export function getAllOrders(req: Request, res: Response<Order[]>, next: NextFunction): void {
    fetchAllOrders()
        .then((orders: Order[]) => res.json(orders))
        .catch((err: unknown) => next(err));
}

interface CreateOrderRequestBody extends Order {
}

export function createOrder(req: Request<unknown, unknown, CreateOrderRequestBody>, res: Response<Order | { error: string }>, next: NextFunction): void {
    const { customer, total, date } = req.body;

    // walidacja
    if (!customer || !total) {
        res.status(400).json({ error: 'customer and total are required' });
        return;
    }

    create({ customer, total, date })
        .then((order: Order) => res.status(201).json(order))
        .catch((err: unknown) => next(err));
}
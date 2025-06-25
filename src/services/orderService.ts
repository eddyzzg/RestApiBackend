import { getAll as getAllOrdersFromSql, Order, CreateOrderRequest, create } from '../models/ordersModel';


/**
 * @returns {Promise<Order[]>} Promise z listą połączonych przedmiotów.
 */
export async function fetchAllOrders(): Promise<Order[]> {
    try {
        const orders: Order[] = await getAllOrdersFromSql();
        console.log(`Fetched ${orders.length} subjects from MySQL.`);
        return orders;
    } catch (err: unknown) {
        console.error('Error in ordersService.fetchAll:', err);
        throw err;
    }
}

export async function createOrder(params: CreateOrderRequest): Promise<Order> {
    try {
        return await create(params);
    } catch (err: unknown) {
        console.error('Error in ordersService.fetchAll:', err);
        throw err;
    }
}
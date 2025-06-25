import { query } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// --- Interfejs dla danych przedmiotu ---
export interface Order extends RowDataPacket {
    id?: number;
    customer: string;
    total: number;
    date: Date;
}

export interface CreateOrderRequest {
    customer: string;
    total: number;
    date: Date;
}

/**
 * Pobiera wszystkie rekordy z tabeli 'subjects'.
 *
 * @returns {Promise<Order[]>} Promise.
 */
export async function getAll(): Promise<Order[]> {
    try {
        const results = await query<Order[]>('SELECT * FROM orders');
        return results;
    } catch (err: unknown) {
        throw err;
    }
}


export async function create(inputData: CreateOrderRequest): Promise<Order> {
    const { customer, total, date } = inputData;
    try {
        const result = await query<ResultSetHeader>('INSERT INTO orders (customer, total, date) VALUES (?, ?, ?)', [customer, total, date]);
        return { id: result.insertId, customer, total, date } as Order;
    } catch (err: unknown) {
        throw err;
    }
}


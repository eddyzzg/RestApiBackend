import { query } from '../config/db';
import { RowDataPacket } from 'mysql2';

// --- Interfejs dla danych przedmiotu ---
export interface Order extends RowDataPacket {
    id: number;
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


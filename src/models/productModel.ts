import { query } from '../config/db';
import { RowDataPacket } from 'mysql2';

// --- Interfejs dla danych przedmiotu ---
export interface Product extends RowDataPacket {
    id: number;
    name: string;
    price: number;
}

/**
 * Pobiera rekord z tabeli 'subjects'.
 *
 * @returns {Promise<Product>} Promise.
 */
export async function get(id: number): Promise<Product> {
    try {
        const results = await query<Product[]>('SELECT id, name, email FROM product WHERE id = ?', [id]);
        return results[0];
    } catch (err: unknown) {
        throw err;
    }
}

/**
 * Pobiera wszystkie rekordy z tabeli 'subjects'.
 *
 * @returns {Promise<Product[]>} Promise.
 */
export async function getAll(): Promise<Product[]> {
    try {
        const results = await query<Product[]>('SELECT * FROM product');
        return results;
    } catch (err: unknown) {
        throw err;
    }
}


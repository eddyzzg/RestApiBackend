import { query } from '../config/db';
import { RowDataPacket } from 'mysql2';

// --- Interfejs dla danych przedmiotu ---
export interface Subject extends RowDataPacket {
    id: number;          // Kolumna 'id' typu INT
    label: string;       // Kolumna 'label' typu VARCHAR
    value: string;       // Kolumna 'value' typu VARCHAR
    creation_date?: Date;       // Kolumna 'value' typu Date
    last_update_date?: Date;       // Kolumna 'value' typu Date
}

/**
 * Pobiera wszystkie rekordy z tabeli 'subjects'.
 *
 * @returns {Promise<Subject[]>} Promise.
 */
export async function getAll(): Promise<Subject[]> {
    try {
        const results = await query<Subject[]>('SELECT * FROM subjects');
        return results;
    } catch (err: unknown) {
        throw err;
    }
}


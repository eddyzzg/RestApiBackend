// src/models/subjectModel.ts

// Importujemy funkcję `query` z naszego poprzednio stypowanego pliku `db.ts`
import { query } from '../config/db';
// Importujemy `RowDataPacket` z mysql2, aby poprawnie rozszerzyć nasz interfejs Subject
import { RowDataPacket } from 'mysql2';

// --- Interfejs dla danych przedmiotu ---
interface Subject extends RowDataPacket {
    id: number;          // Kolumna 'id' typu INT
    label: string;       // Kolumna 'label' typu VARCHAR
    value: string;       // Kolumna 'value' typu VARCHAR
}

/**
 * Pobiera wszystkie rekordy z tabeli 'subjects'.
 *
 * @returns {Promise<Subject[]>} Promise, który rozwiąże się z tablicą obiektów typu Subject.
 * W przypadku błędu, Promise zostanie odrzucony z obiektem błędu.
 */
export async function getAll(): Promise<Subject[]> {
    // Ponieważ funkcja 'query' jest asynchroniczna i zwraca Promise,
    // możemy użyć async/await dla czystszego kodu.
    // Ważne: Jawnie typujemy `query` jako `Subject[]`,
    // informując TypeScript, że spodziewamy się tablicy obiektów typu Subject.
    try {
        const results = await query<Subject[]>('SELECT * FROM subjects');
        return results; // Wyniki są już typu Subject[] dzięki generycznemu typowaniu `query`
    } catch (err: unknown) {
        // Rzuć błąd ponownie, aby wyższy poziom (np. kontroler) mógł go obsłużyć.
        throw err;
    }
}
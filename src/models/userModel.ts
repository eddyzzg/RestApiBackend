import { query } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// --- Interfejsy dla typowania danych użytkownika ---
interface User extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password?: string;
}

interface CreateUserInput {
    name: string;
    email: string;
}

interface UpdateUserInput {
    name?: string;
    email?: string;
}

// --- Funkcje Modelu (CRUD) ---
export async function getAll(): Promise<User[]> {
    try {
        // Jawnie typujemy wyniki zapytania jako User[]
        const users = await query<User[]>('SELECT id, name, email FROM users'); // Wskazuj kolumny zamiast '*' dla lepszej kontroli
        return users;
    } catch (err: unknown) {
        throw err;
    }
}

export async function getById(id: number): Promise<User | undefined> {
    try {
        // `query` zwróci tablicę, więc bierzemy pierwszy element.
        // Pamiętaj, że `query` jest typowane na `T[]` w `db.ts`, więc tu musimy dać `User[]`.
        const users = await query<User[]>('SELECT id, name, email FROM users WHERE id = ?', [id]);
        return users[0]; // Zwracamy pierwszy element lub undefined
    } catch (err: unknown) {
        throw err;
    }
}

export async function create(userData: CreateUserInput): Promise<User> {
    const { name, email } = userData;
    try {
        const result = await query<ResultSetHeader>('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        return { id: result.insertId, name, email } as User; // Rzutujemy na User
    } catch (err: unknown) {
        throw err;
    }
}

export async function update(id: number, userData: UpdateUserInput): Promise<User | undefined> {
    const { name, email } = userData;

    // Budowanie dynamicznego zapytania SQL i parametrów
    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
    }
    if (email !== undefined) {
        updates.push('email = ?');
        params.push(email);
    }

    if (updates.length === 0) {
        const existingUser = await getById(id);
        return existingUser;
    }

    params.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    try {
        const result = await query<ResultSetHeader>(sql, params);

        if (result.affectedRows === 0) {
            return undefined;
        }
        const updatedUser = await getById(id);
        return updatedUser;
    } catch (err: unknown) {
        throw err;
    }
}

export async function remove(id: number): Promise<number> {
    try {
        const result = await query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    } catch (err: unknown) {
        throw err;
    }
}
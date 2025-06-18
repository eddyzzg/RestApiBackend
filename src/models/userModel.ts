// src/models/userModel.ts

import { query } from '../config/db'; // Import funkcji `query` z db.ts
import { RowDataPacket, ResultSetHeader } from 'mysql2'; // Import typów z mysql2

// --- Interfejsy dla typowania danych użytkownika ---

// Interfejs reprezentujący użytkownika z bazy danych
// MUSI DOKŁADNIE PASOWAĆ do kolumn w Twojej tabeli 'users'.
// Rozszerzamy RowDataPacket, ponieważ wyniki z bazy danych mają też inne właściwości.
interface User extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password?: string;
}

// Interfejs dla danych wejściowych przy tworzeniu użytkownika
interface CreateUserInput {
    name: string;
    email: string;
}

// Interfejs dla danych wejściowych przy aktualizacji użytkownika
interface UpdateUserInput {
    name?: string; // Opcjonalne, bo można zaktualizować tylko name lub tylko email
    email?: string; // Opcjonalne
}

// --- Funkcje Modelu (CRUD) ---

/**
 * Pobiera wszystkich użytkowników z bazy danych.
 * @returns Promise, który rozwiązuje się z tablicą obiektów typu User.
 */
export async function getAll(): Promise<User[]> {
    try {
        // Jawnie typujemy wyniki zapytania jako User[]
        const users = await query<User[]>('SELECT id, name, email FROM users'); // Wskazuj kolumny zamiast '*' dla lepszej kontroli
        return users;
    } catch (err: unknown) {
        throw err;
    }
}

/**
 * Pobiera użytkownika po jego ID.
 * @param id ID użytkownika do pobrania.
 * @returns Promise, który rozwiązuje się z obiektem typu User lub undefined, jeśli użytkownik nie istnieje.
 */
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

/**
 * Tworzy nowego użytkownika w bazie danych.
 * @param userData Obiekt zawierający name i email nowego użytkownika.
 * @returns Promise, który rozwiązuje się z nowo utworzonym obiektem typu User (wraz z wygenerowanym ID).
 */
export async function create(userData: CreateUserInput): Promise<User> {
    const { name, email } = userData;
    try {
        // query dla INSERT zwróci ResultSetHeader
        const result = await query<ResultSetHeader>('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        // Tworzymy i zwracamy pełny obiekt User z nowym ID
        return { id: result.insertId, name, email } as User; // Rzutujemy na User
    } catch (err: unknown) {
        throw err;
    }
}

/**
 * Aktualizuje dane użytkownika.
 * @param id ID użytkownika do aktualizacji.
 * @param userData Obiekt zawierający name i/lub email do zaktualizowania.
 * @returns Promise, który rozwiązuje się z zaktualizowanym obiektem User lub undefined, jeśli użytkownik nie został znaleziony/zaktualizowany.
 */
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
        // Nic do aktualizacji, można zwrócić istniejącego użytkownika lub undefined
        const existingUser = await getById(id);
        return existingUser;
    }

    params.push(id); // Dodaj ID na końcu do WHERE clause
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    try {
        const result = await query<ResultSetHeader>(sql, params);

        if (result.affectedRows === 0) {
            return undefined; // Użytkownik nie znaleziony lub brak zmian
        }
        // Po aktualizacji pobieramy zaktualizowanego użytkownika, aby zwrócić jego pełne dane
        const updatedUser = await getById(id);
        return updatedUser;
    } catch (err: unknown) {
        throw err;
    }
}

/**
 * Usuwa użytkownika po ID.
 * @param id ID użytkownika do usunięcia.
 * @returns Promise, który rozwiązuje się z liczbą usuniętych wierszy (0 lub 1).
 */
export async function remove(id: number): Promise<number> {
    try {
        // query dla DELETE również zwróci ResultSetHeader
        const result = await query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows; // Zwraca liczbę zmienionych wierszy (tutaj 0 lub 1)
    } catch (err: unknown) {
        throw err;
    }
}
// src/db.ts (lub odpowiednia ścieżka)

import mysql, { Connection, FieldPacket, RowDataPacket, ResultSetHeader } from 'mysql2';

// Interfejs dla opcji połączenia, aby TypeScript wiedział, jakie są dostępne
interface DbConnectionOptions {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
}

// Konfiguracja połączenia z bazą danych
// Używamy Type Assertion 'as DbConnectionOptions' aby upewnić się,
// że obiekt jest zgodny z naszym interfejsem, chociaż ENV są stringami.
const connectionOptions: DbConnectionOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Allegro66',
    database: process.env.DB_NAME || 'myapp',
};

// Tworzenie połączenia z bazą danych
const connection: Connection = mysql.createConnection(connectionOptions);

/**
 * Wykonuje zapytanie SQL i zwraca Promise z wynikami.
 *
 * @param sql Zapytanie SQL do wykonania.
 * @param params Parametry do zapytania SQL (opcjonalne).
 * @returns Promise, który rozwiązuje się z wynikami zapytania.
 * Typ `RowDataPacket[]` jest używany dla wyników, `FieldPacket[]` dla metadanych kolumn.
 * Możesz uściślić `RowDataPacket[]` do konkretnego typu, jeśli znasz strukturę danych.
 */
export function query<T extends RowDataPacket[] | ResultSetHeader>(
    sql: string,
    params?: any[] | { [key: string]: any } // Parametry mogą być tablicą lub obiektem
): Promise<T> {
    return new Promise((resolve, reject) => {
        // connection.query przyjmuje callback z typowymi argumentami (err, results, fields)
        connection.query(sql, params, (err: mysql.QueryError | null, results: RowDataPacket[], fields: FieldPacket[]) => {
            if (err) {
                return reject(err); // Jeśli wystąpi błąd, odrzuć Promise'a
            }
            // Typujemy 'results' jako 'T' - typ, który oczekujemy od bazy danych
            resolve(results as T);
        });
    });
}
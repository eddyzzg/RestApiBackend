// db.ts
import mysql, { Connection, FieldPacket, RowDataPacket, ResultSetHeader } from 'mysql2';
import mongoose from 'mongoose'; // Dodaj import mongoose
import dotenv from 'dotenv';

import { initMongoDB } from '../models/mongo/MongoSubjectModel';

dotenv.config();

// --- Interfejsy dla opcji połączenia ---
interface MysqlConnectionOptions {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
    port?: number; // Dodaj port, często używany w MySQL
}

// --- Konfiguracja MySQL ---
const mysqlConnectionOptions: MysqlConnectionOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Allegro66',
    database: process.env.DB_NAME || 'myapp',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // Domyślny port MySQL
};

// Tworzenie połączenia MySQL (jednorazowe połączenie, nie pula)
// Zazwyczaj dla aplikacji webowych używa się puli połączeń mysql2.Pool,
// aby efektywniej zarządzać zasobami. Dla prostych zastosowań Connection jest ok.
const mysqlConnection: Connection = mysql.createConnection(mysqlConnectionOptions);

// Funkcja do testowania połączenia MySQL (opcjonalnie)
export const connectMySQL = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        mysqlConnection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err.message);
                return reject(err);
            }
            console.log('Connected to MySQL database.');
            resolve();
        });
    });
};

/**
 * Wykonuje zapytanie SQL i zwraca Promise z wynikami.
 *
 * @param sql Zapytanie SQL.
 * @param params Parametry do zapytania SQL.
 * @returns Promise
 * 
 * Typ `RowDataPacket[]` jest używany dla wyników, `FieldPacket[]` dla metadanych kolumn.
 */
export function query<T extends RowDataPacket[] | ResultSetHeader>(
    sql: string,
    params?: any[] | { [key: string]: any } // Parametry mogą być tablicą lub obiektem
): Promise<T> {
    return new Promise((resolve, reject) => {
        // connection.query przyjmuje callback z typowymi argumentami (err, results, fields)
        mysqlConnection.query(sql, params, (err: mysql.QueryError | null, results: RowDataPacket[], fields: FieldPacket[]) => {
            if (err) {
                return reject(err); // Jeśli wystąpi błąd, odrzuć Promise'a
            }
            // Typujemy 'results' jako 'T' - typ, który oczekujemy od bazy danych
            resolve(results as T);
        });
    });
}

// --- Konfiguracja MongoDB ---

/**
 * Nawiązuje połączenie z bazą danych MongoDB.
 * Używa URI z zmiennej środowiskowej MONGODB_URI.
 */
export const connectMongoDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables.');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // ensure db exists and init by seed if it's not
        await initMongoDB();

    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export { mongoose };
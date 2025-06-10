import { query } from '../config/db.js';

export function getAll() {
    return new Promise((resolve, reject) => {
        query('SELECT * FROM subjects', (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

import { query } from '../config/db.js';

export function getAll() {
    return new Promise((resolve, reject) => {
        query('SELECT * FROM users', (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

export function getById(id) {
    return new Promise((resolve, reject) => {
        query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
}

export function create({ name, email }) {
    return new Promise((resolve, reject) => {
        query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
            if (err) reject(err);
            else resolve({ id: result.insertId, name, email });
        });
    });
}

export function update(id, { name, email }) {
    return new Promise((resolve, reject) => {
        query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

export function remove(id) {
    return new Promise((resolve, reject) => {
        query('DELETE FROM users WHERE id = ?', [id], err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

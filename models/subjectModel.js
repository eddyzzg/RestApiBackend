import { query } from '../config/db.js';

export function getAll() {
    return new Promise((resolve, reject) => {
        query('SELECT * FROM subjects', (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}


// GET SUBJECTS
// app.get('/subjects', (req, res) => {

//     db.query('SELECT * FROM subjects', (err, results) => {
//         if (err) {
//             console.error('Błąd podczas pobierania tematów:', err);
//             res.status(500).json({ error: 'Błąd serwera' });
//             return;
//         }
//         res.json(results);
//     });
// });
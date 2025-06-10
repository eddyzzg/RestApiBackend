import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const SALT_ROUNDS = 10;

export async function register(req, res, next) {
    const { name, email, password } = req.body;
    try {
        const rows = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length) {
            return res.status(400).json({ message: 'Email już istnieje' });
        }
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);
        res.status(201).json({ message: 'Rejestracja udana.' });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        const rows = await query('SELECT id, name, password FROM users WHERE email = ?', [email]);
        if (!rows.length) return res.status(401).json({ message: 'Niepoprawne dane' });

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password?.toString());

        if (!isValid) return res.status(401).json({ message: 'Niepoprawne dane' });

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.json({ token });
    } catch (err) {
        next(err);
    }
}

export function authenticateToken(req, res, next) {
    const auth = req.headers['authorization']?.split(' ');
    if (auth?.[0] !== 'Bearer' || !auth[1]) {
        return res.status(401).json({ message: 'Brak tokenu' });
    }
    jwt.verify(auth[1], process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ message: 'Niepoprawny token' });
        req.user = payload;
        next();
    });
}

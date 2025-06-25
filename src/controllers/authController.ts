import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db'; // Assuming db.ts is in ../config/db.ts now
import { RowDataPacket } from 'mysql2'; // Import RowDataPacket for database results

// --- Interfaces for Type Safety ---

// Extend the Express Request type to include a 'user' property for authenticated users.
// This is crucial for passing user payload between middleware.
declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload; // Make sure to define UserPayload below
    }
}

interface UserPayload {
    id: number;
    name: string;
}

// Interface for user data retrieved from the database
interface DbUserRow extends RowDataPacket {
    id: number;
    name: string;
    password?: string; // Password might be omitted in some queries, or present for login check
}

// Interface for the request body in register endpoint
interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
}

// Interface for the request body in login endpoint
interface LoginRequestBody {
    email: string;
    password: string;
}

const SALT_ROUNDS = 10;

// Ensure JWT_SECRET and JWT_EXPIRES_IN are defined in environment variables
// It's good practice to throw an error early if they are missing
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}
const JWT_SECRET: string = process.env.JWT_SECRET; // Explicitly type after check

// JWT_EXPIRES_IN is optional based on your setup, but good to type if used
const JWT_EXPIRES_IN: string | undefined = process.env.JWT_EXPIRES_IN;


// --- Controller Functions ---

export async function register(req: Request<unknown, unknown, RegisterRequestBody>, res: Response, next: NextFunction): Promise<void> {
    const { name, email, password } = req.body;

    try {
        // Type the query result to expect an array of DbUserRow, which includes 'id'
        const rows = await query<DbUserRow[]>('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);
        res.status(201).json({ message: 'Registration successful.' });
    } catch (err: unknown) {
        next(err);
    }
}

export async function login(req: Request<unknown, unknown, LoginRequestBody>, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
        // Type the query result to expect an array of DbUserRow including id, name, and password
        const rows = await query<DbUserRow[]>('SELECT id, name, password FROM users WHERE email = ?', [email]);

        if (!rows.length) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const user = rows[0];

        if (user.password === undefined) {
            console.log(user.password);
            res.status(401).json({ message: 'Invalid credentials format' });
            return;
        }
        const passString: string = user.password?.toString();

        // bcrypt.compare expects string for hash. user.password can be undefined if SELECT didn't include it
        // We add a check for user.password to ensure it's a string, or provide a default empty string.
        const isValid = await bcrypt.compare(password, passString || '');

        if (!isValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Ensure JWT_SECRET is not undefined before using it
        if (!JWT_SECRET) {
            // This case should be handled by the initial throw new Error, but defensive coding here.
            throw new Error("JWT_SECRET is not set. Cannot sign token.");
        }

        const token = jwt.sign(
            { id: user.id, name: user.name }, // Payload for the token
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN || '1h' } as jwt.SignOptions // Provide a default if JWT_EXPIRES_IN is undefined
        );

        res.json({ token });
    } catch (err: unknown) {
        next(err);
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token || authHeader?.split(' ')[0] !== 'Bearer') { // Check if token exists and if it's a Bearer token
        res.status(401).json({ message: 'No token provided or invalid format' });
        return;
    }

    // Ensure JWT_SECRET is not undefined before using it
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set. Cannot verify token.");
    }

    // Type the payload
    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, payload: string | jwt.JwtPayload | undefined) => {
        if (err) {
            res.status(403).json({ message: 'Invalid token' });
            return;
        }

        // Narrowing the payload type and assigning it to req.user
        if (typeof payload === 'object' && payload !== null && 'id' in payload && 'name' in payload) {
            req.user = payload as UserPayload; // Cast to our UserPayload interface
        } else {
            // Handle cases where payload is not as expected or is just a string
            console.warn("JWT payload not in expected format:", payload);
            res.status(403).json({ message: 'Invalid token payload' });
            return;
        }

        next();
    });
}
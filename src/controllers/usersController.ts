import { Request, Response, NextFunction } from 'express';
import { getAll, getById, create, update, remove } from '../models/userModel';

// --- Interfejsy dla typowania danych użytkownika ---
interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
}

interface CreateUserRequestBody {
    name: string;
    email: string;
}

interface UpdateUserRequestBody {
    name?: string;
    email?: string;
}

// --- Funkcje Kontrolera ---
export function getAllUsers(req: Request, res: Response<User[]>, next: NextFunction): void {
    getAll()
        .then((users: User[]) => res.json(users))
        .catch((err: unknown) => next(err));
}

export function getUserById(req: Request<{ id: string }>, res: Response<User | { error: string }>, next: NextFunction): void {
    const userId = parseInt(req.params.id, 10); // Konwertujemy string ID na number

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
    }

    getById(userId)
        .then((user: User | undefined) => user ? res.json(user) : res.status(404).json({ error: 'User not found' }))
        .catch((err: unknown) => next(err));
}

export function createUser(req: Request<unknown, unknown, CreateUserRequestBody>, res: Response<User | { error: string }>, next: NextFunction): void {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
    }

    create({ name, email })
        .then((user: User) => res.status(201).json(user))
        .catch((err: unknown) => next(err));
}

export function updateUser(req: Request<{ id: string }, unknown, UpdateUserRequestBody>, res: Response<User | { error: string }>, next: NextFunction): void {
    const userId = parseInt(req.params.id, 10);
    const { name, email } = req.body;

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
    }
    if (!name && !email) {
        res.status(400).json({ error: 'No update data provided' });
        return;
    }

    update(userId, { name, email })
        .then((updatedUser: User | undefined) => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found or nothing to update' });
            }
            res.json(updatedUser);
        })
        .catch((err: unknown) => next(err));
}

export function removeUser(req: Request<{ id: string }>, res: Response<void | { error: string }>, next: NextFunction): void {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
    }

    remove(userId)
        .then((rowCount: number) => {
            if (rowCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(204).send();
        })
        .catch((err: unknown) => next(err));
}
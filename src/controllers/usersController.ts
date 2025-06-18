// src/controllers/usersController.ts

import { Request, Response, NextFunction } from 'express';
// Importujemy funkcje z naszego modelu użytkownika
import { getAll, getById, create, update, remove } from '../models/userModel'; // Pamiętaj o konwersji userModel.js na .ts!

// --- Interfejsy dla typowania danych użytkownika ---

// Pełny interfejs użytkownika, tak jak jest przechowywany w bazie danych i zwracany
// Upewnij się, że ten interfejs DOKŁADNIE odpowiada kolumnom w Twojej tabeli 'users'.
// Przykładowe pola, dostosuj do rzeczywistości!
interface User {
    id: number;
    name: string;
    email: string;
    password?: string; // Jeśli zwracasz hasło (choć nie powinieneś go zwracać w API dla getAll/getById)
}

// Interfejs dla danych wejściowych przy tworzeniu użytkownika (req.body)
// W tym przypadku nie ma 'id', bo jest generowane automatycznie
interface CreateUserRequestBody {
    name: string;
    email: string;
}

// Interfejs dla danych wejściowych przy aktualizacji użytkownika (req.body)
// Pola mogą być opcjonalne, bo użytkownik nie musi aktualizować wszystkiego
interface UpdateUserRequestBody {
    name?: string;
    email?: string;
}

// --- Funkcje Kontrolera ---

/**
 * Pobiera wszystkich użytkowników.
 * @param req Obiekt żądania Express.
 * @param res Obiekt odpowiedzi Express, zwracający tablicę użytkowników.
 * @param next Funkcja do przekazania kontroli do następnego middleware.
 */
export function getAllUsers(req: Request, res: Response<User[]>, next: NextFunction): void {
    getAll()
        .then((users: User[]) => res.json(users))
        .catch((err: unknown) => next(err));
}

/**
 * Pobiera użytkownika po ID.
 * @param req Obiekt żądania Express z parametrem 'id'.
 * @param res Obiekt odpowiedzi Express, zwracający pojedynczego użytkownika lub błąd 404.
 * @param next Funkcja do przekazania kontroli do następnego middleware.
 */
export function getUserById(req: Request<{ id: string }>, res: Response<User | { error: string }>, next: NextFunction): void {
    const userId = parseInt(req.params.id, 10); // Konwertujemy string ID na number

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' }); // Dodano walidację ID
        return;
    }

    getById(userId) // Przekazujemy number ID
        .then((user: User | undefined) => user ? res.json(user) : res.status(404).json({ error: 'User not found' }))
        .catch((err: unknown) => next(err));
}

/**
 * Tworzy nowego użytkownika.
 * @param req Obiekt żądania Express z danymi użytkownika w ciele żądania.
 * @param res Obiekt odpowiedzi Express, zwracający nowo utworzonego użytkownika.
 * @param next Funkcja do przekazania kontroli do następnego middleware.
 */
export function createUser(req: Request<unknown, unknown, CreateUserRequestBody>, res: Response<User | { error: string }>, next: NextFunction): void {
    const { name, email } = req.body;
    // Możesz dodać podstawową walidację danych wejściowych
    if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
    }

    create({ name, email })
        .then((user: User) => res.status(201).json(user))
        .catch((err: unknown) => next(err));
}

/**
 * Aktualizuje istniejącego użytkownika.
 * @param req Obiekt żądania Express z ID użytkownika w parametrach i danymi do aktualizacji w ciele.
 * @param res Obiekt odpowiedzi Express.
 * @param next Funkcja do przekazania kontroli do następnego middleware.
 */
export function updateUser(req: Request<{ id: string }, unknown, UpdateUserRequestBody>, res: Response<User | { error: string }>, next: NextFunction): void {
    const userId = parseInt(req.params.id, 10);
    const { name, email } = req.body;

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
    }
    // Sprawdź, czy coś jest do aktualizacji
    if (!name && !email) {
        res.status(400).json({ error: 'No update data provided' });
        return;
    }

    update(userId, { name, email })
        .then((updatedUser: User | undefined) => { // userModel.update powinno zwrócić zaktualizowanego użytkownika lub undefined
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found or nothing to update' });
            }
            res.json(updatedUser); // Zwracamy zaktualizowanego użytkownika
        })
        .catch((err: unknown) => next(err));
}

/**
 * Usuwa użytkownika po ID.
 * @param req Obiekt żądania Express z ID użytkownika w parametrach.
 * @param res Obiekt odpowiedzi Express, zwracający status 204 po sukcesie.
 * @param next Funkcja do przekazania kontroli do następnego middleware.
 */
export function removeUser(req: Request<{ id: string }>, res: Response<void | { error: string }>, next: NextFunction): void {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
    }

    remove(userId)
        .then((rowCount: number) => { // Oczekujemy liczbę usuniętych wierszy
            if (rowCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(204).send(); // 204 No Content
        })
        .catch((err: unknown) => next(err));
}
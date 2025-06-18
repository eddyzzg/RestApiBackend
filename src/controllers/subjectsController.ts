import { Request, Response, NextFunction } from 'express';
import { getAll } from '../models/subjectModel';

// --- Interfaces for Type Safety ---

// Zdefiniuj interfejs dla pojedynczego przedmiotu (Subject).
// Dostosuj te właściwości do rzeczywistej struktury danych z Twojej bazy.
interface Subject {
    id: number;          // Kolumna 'id' typu INT
    label: string;       // Kolumna 'label' typu VARCHAR
    value: string;       // Kolumna 'value' typu VARCHAR
}

// --- Controller Functions ---

/**
 * Pobiera wszystkie przedmioty z bazy danych i wysyła je jako odpowiedź JSON.
 * W przypadku błędu, przekazuje go do następnego middleware (funkcji obsługi błędów Express).
 *
 * @param req Obiekt żądania Express.
 * @param res Obiekt odpowiedzi Express.
 * @param next Funkcja do przekazania kontroli do następnego middleware.
 */
export function getAllSubjects(req: Request, res: Response<Subject[]>, next: NextFunction): void {
    getAll()
        .then((subjects: Subject[]) => res.json(subjects))
        .catch((err: unknown) => next(err)); // Typujemy błąd jako 'unknown'
}
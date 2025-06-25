import { Request, Response, NextFunction } from 'express';
import { CombinedSubject } from '../services/subjectService';
import { fetchAllSubjects } from '../services/subjectService';

/**
 * @param req Obiekt żądania Express.
 * @param res Obiekt odpowiedzi Express.
 * @param next Funkcja do przekazania kontroli do następnego middleware.
 */
export function getAllSubjects(req: Request, res: Response<CombinedSubject[]>, next: NextFunction): void {
    fetchAllSubjects()
        .then((subjects: CombinedSubject[]) => res.json(subjects))
        .catch((err: unknown) => next(err));
}
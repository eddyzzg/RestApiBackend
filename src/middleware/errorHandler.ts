import { Request, Response, NextFunction } from 'express';

class HttpError extends Error {
    status: number;
    constructor(message: string, status: number = 500) {
        super(message);
        this.status = status;
        // dla TypeScript
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

/**
 * Globalny middleware do obsługi błędów w aplikacji Express.
 * Wyłapuje błędy przekazane przez `next(err)` z innych middleware'ów lub routów.
 *
 * @param err Obiekt błędu.
 * @param req Obiekt żądania Express.
 * @param res Obiekt odpowiedzi Express.
 * @param next Funkcja do przekazania kontroli do następnego middleware (rzadko używane w finalnym error handlerze).
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const errorMessage = err.message || 'Server Error';
    const statusCode = err instanceof HttpError && err.status ? err.status : 500;

    // Wysłanie odpowiedzi o błędzie do klienta
    res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;

// src/app.ts (lub src/index.ts)

import 'dotenv/config'; // Importuje i ładuje zmienne środowiskowe z pliku .env

import express, { Request, Response, NextFunction } from 'express'; // Jawny import typów z Express
import cors from 'cors';

// Import routerów (pamiętaj, że ich pliki .js powinny być już przekonwertowane na .ts)
import authRouter from './routes/auth'; // Bez .js
import usersRouter from './routes/users'; // Bez .js
import subjectsRouter from './routes/subjects'; // Bez .js

// Import middleware do obsługi błędów (pamiętaj o konwersji na .ts)
import errorHandler from './middleware/errorHandler'; // Bez .js

const app = express();
const port: number = parseInt(process.env.PORT || '4000', 10); // Pobieramy port ze zmiennych środowiskowych lub domyślnie 4000

// --- Konfiguracja Middleware ---
app.use(cors()); // Włącza Cross-Origin Resource Sharing
app.use(express.json()); // Włącza parsowanie JSON dla ciał żądań

// --- Routing ---

// Router dla autentykacji (np. login, register)
app.use(authRouter);

// TEN SAM errorHandler z `middleware/errorHandler.ts`
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err);
    const message = err.message || 'An unexpected error occurred';
    res.status(500).json({ message }) as Response;
    return;
});

// Główny endpoint powitalny
app.get('/', (_req: Request, res: Response) => res.send('Backend is running!'));

// Routing dla zasobów (users, subjects)
app.use('/users', usersRouter);
app.use('/subjects', subjectsRouter);

// Globalny handler błędów (Catch-all error handler)
// To jest ostatni middleware, który łapie wszystkie błędy, które nie zostały obsłużone wcześniej.
app.use(errorHandler);

// --- Uruchomienie Serwera ---
app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
    console.log(`TypeScript Express App listening on port ${port}`);
});
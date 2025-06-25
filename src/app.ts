import 'dotenv/config'; // Lepszy sposób na załadowanie dotenv w nowszych wersjach
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Importuj funkcje połączeniowe z db.ts
import { connectMySQL, connectMongoDB } from './config/db';

// Import routerów
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import subjectsRouter from './routes/subjects';

// Import middleware do obsługi błędów
import errorHandler from './middleware/errorHandler';

const app = express();
const port: number = parseInt(process.env.PORT || '4000', 10);

// --- Konfiguracja Middleware ---
app.use(cors());
app.use(express.json());

// --- Funkcja startowa aplikacji ---
async function startApp() {
    try {
        await connectMySQL();
        await connectMongoDB();

        // Router dla autentykacji (np. login, register)
        app.use(authRouter);

        // Routery dla zasobów (users, subjects)
        app.use('/users', usersRouter);
        app.use('/subjects', subjectsRouter);

        // Główny endpoint powitalny
        app.get('/', (_req: Request, res: Response) => res.send('Backend is running!'));

        // ale przed globalnym 'catch-all'.
        app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
            console.error(err);
            const message = err.message || 'An unexpected error occurred';
            res.status(500).json({ message }); // Zamiast 'as Response'
            return;
        });

        // Globalny handler błędów (Catch-all error handler)
        app.use(errorHandler);

        // --- Uruchomienie Serwera ---
        app.listen(port, () => {
            console.log(`Server running on: http://localhost:${port}`);
            console.log(`TypeScript Express App listening on port ${port}`);
        });

    } catch (error) {
        console.error('Aplikacja nie mogła się uruchomić z powodu błędu połączenia z bazą danych:', error);
        process.exit(1);
    }
}

startApp();
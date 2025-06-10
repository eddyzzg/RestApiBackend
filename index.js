import 'dotenv/config';

import express, { json } from 'express';
import cors from 'cors';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import subjectsRouter from './routes/subjects.js';

import errorHandler from './middleware/errorHandler.js';

const app = express();
const port = 4000;

app.use(cors());
app.use(json());

// --- login --- //
app.use(authRouter);
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: err.message });
});


// --- endpoints ---//
app.get('/', (req, res) => res.send('Backend działa!'));
app.use('/users', usersRouter);
app.use('/subjects', subjectsRouter);
app.use(errorHandler);

app.listen(port, () =>
    console.log(`Serwer działa: http://localhost:${port}`)
);

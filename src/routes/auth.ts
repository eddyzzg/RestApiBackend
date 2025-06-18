import express, { Request, Response, Router } from 'express';
import { register, login, authenticateToken } from '../controllers/authController';

const router: Router = Router(); // Jawne typowanie routera

router.post('/register', register);
router.post('/login', login);

router.get('/protected', authenticateToken, (req: Request, res: Response) => {
    if (req.user) {
        res.json({ msg: 'Protected access granted!', user: req.user });
    } else {
        res.status(401).json({ msg: 'Unauthorized: No user data found in token.' });
    }
});

export default router;
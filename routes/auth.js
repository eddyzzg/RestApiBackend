import express from 'express';
import { register, login, authenticateToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ msg: 'Dostęp chroniony', user: req.user });
});

export default router;

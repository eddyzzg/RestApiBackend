import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    removeUser
} from '../controllers/usersController';

const router = express.Router();

//user endpoints
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', removeUser);

export default router;

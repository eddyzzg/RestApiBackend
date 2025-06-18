import express, { Router } from 'express';
import { getAllSubjects } from '../controllers/subjectsController';

const router: Router = express.Router(); // Jawne typowanie routera

router.get('/', getAllSubjects);

export default router;
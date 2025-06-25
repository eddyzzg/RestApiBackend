import express, { Router } from 'express';
import { getAllSubjects } from '../controllers/subjectsController';

const router: Router = express.Router();

router.get('/', getAllSubjects);

export default router;
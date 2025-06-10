import express from 'express';
import { getAllSubjects } from '../controllers/subjectsController.js';

const router = express.Router();

//subjects endpoints
router.get('/', getAllSubjects);

export default router;

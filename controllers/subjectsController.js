import { getAll } from '../models/subjectModel.js';

export function getAllSubjects(req, res, next) {
    getAll()
        .then(users => res.json(users))
        .catch(next);
}
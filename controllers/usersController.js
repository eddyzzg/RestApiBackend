import { getAll, getById, create, update, remove } from '../models/userModel.js';

export function getAllUsers(req, res, next) {
    getAll()
        .then(users => res.json(users))
        .catch(next);
}

export function getUserById(req, res, next) {
    const { id } = req.params;
    getById(id)
        .then(user => user ? res.json(user) : res.status(404).json({ error: 'Użytkownik nie znaleziony' }))
        .catch(next);
}

export function createUser(req, res, next) {
    const { name, email } = req.body;
    create({ name, email })
        .then(user => res.status(201).json(user))
        .catch(next);
}

export function updateUser(req, res, next) {
    const { id } = req.params;
    const { name, email } = req.body;
    update(id, { name, email })
        .then(() => res.json({ id, name, email }))
        .catch(next);
}

export function removeUser(req, res, next) {
    const { id } = req.params;
    remove(id)
        .then(() => res.status(204).send())
        .catch(next);
}

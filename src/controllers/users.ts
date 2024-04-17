import { Request, Response } from 'express';
import { UserService } from '../services/userService';

function getAllUsers(req: Request, res: Response) {
    new UserService()
        .getAllUsers()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: 'Error getting users', error: err }));
}

function getUserProfileById(req: Request, res: Response) {
    new UserService()
        .getUserById(parseInt(req.params.id))
        .then(user => user ? res.json(user) : res.status(404).json({ message: 'User not found' }))
        .catch(err => res.status(500).json({ message: 'Error getting user', error: err }));
}

export default { getAllUsers, getUserProfileById}
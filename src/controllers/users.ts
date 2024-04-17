import { Request, Response } from 'express';
import { UserService } from '../services/userService';

function getAllUsers(req: Request, res: Response) {
    const {firstName, lastName, hobby} = req.query;

    new UserService()
        .getUsers(      
            firstName ? firstName as string : undefined,
            lastName ? lastName as string : undefined, 
            hobby ? parseInt(hobby as string) : undefined)
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
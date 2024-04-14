import express, { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { User } from '../database/databaseManager';

const router = express.Router();
const userService = new UserService();

router.post('/', async (req: Request, res: Response) => {
    try {
        const newUser: Omit<User, 'id'> = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            photo: req.body.photo,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            hobbies: []
        };

        const created = await userService.createUser(newUser);
        res.status(201).json(newUser);
    } catch(err) {
        res.status(400).json({message: 'Error while creating new user', error: err})
    }
});


export default router;
import express, { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { User } from '../model/user';
import bcrypt from 'bcrypt';
import { Gender } from '../model/gender';

const router = express.Router();
const userService = new UserService();
const saltRounds = 10;


router.post('/', async (req: Request, res: Response) => {
    try {

        if (req.body.gender && !Object.values(Gender).includes(req.body.gender as Gender)) {
            return res.status(400).json({ message: 'Invalid gender provided' });
        }

        const newUser: Omit<User, 'id'> = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, saltRounds),
            photo: '',
            birthDate: req.body.birthDate,
            gender: req.body.gender,
        };

        const created = await userService.createUser(newUser);
        res.status(201).json(newUser);
    } catch(err) {
        res.status(400).json({message: 'Error while creating new user', error: err})
    }
});


export default router;
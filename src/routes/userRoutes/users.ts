import express, { Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { User } from '../../database/databaseManager';

const router = express.Router();
const userService = new UserService();

// Async permite una sintaxis mas linda para trabajar con Promises
// Ahora, no se si es lo correcto o no usarlo asi.
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error getting users', error: err });
  }
});

export default router;

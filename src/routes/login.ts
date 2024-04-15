import express, { Request, Response } from 'express';
import { generateTokens } from '../middleware/jwt';
import HTTPErrorCodes from '../utilities/httpErrorCodes';
import bcrypt from 'bcrypt';
import { UserService } from '../services/userService';

const saltRounds = 10;
const userService = new UserService();
const router = express.Router();

// Endpoint de prueba para verificar que la ruta funciona
router.post('/', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const basicAuthString = authHeader && authHeader.split(' ')[1];

  if (!basicAuthString) {
    return res.sendStatus(HTTPErrorCodes.Unauthorized);
  }

  // Decodificamos el string de autorización
  const [username, password] = Buffer.from(basicAuthString, 'base64').toString().split(':');

  // Validamos contra la DB
  userService.getUserByEmail(username)
    .then(user => {
      if (!user)
        return res.status(HTTPErrorCodes.Unauthorized).json({ error: "User not found" });

      const userPassword = user.password.toString();
      return bcrypt.compare(password, userPassword)
        .then(equal => {
          if (!equal)
            return res.status(HTTPErrorCodes.Unauthorized).json({ error: "Password is not correct" });

          const email = user.email.toString();
          return res.json(generateTokens(user.id, email));
        })
    })
    .catch(err => {
      const errMessage: string = err.message || "Database error";
      return res.status(HTTPErrorCodes.InternalServerError).json({ message: 'Error during login', error: errMessage })
    });
});

export default router;

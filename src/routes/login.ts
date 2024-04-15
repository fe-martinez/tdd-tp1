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
  try {
    const savedPassword = await userService.getUserPassword(username);
    if(!savedPassword) {
      return res.sendStatus(HTTPErrorCodes.Unauthorized).json({error: "Email not found in db"});
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (await bcrypt.compare(savedPassword.toString(), hashedPassword)) {
      res.json(generateTokens(username, password));
    } else {
      res.sendStatus(HTTPErrorCodes.Unauthorized).json({error: "Password is not correct"});
    }
  } catch (error) {
    res.json({ error: 'Error de contraseña: ' + error });
  }
});

export default router;

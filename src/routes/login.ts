import express, { Request, Response } from 'express';
import { generateTokens } from '../middleware/jwt';
import HTTPErrorCodes from '../utilities/httpErrorCodes';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const getUserPassword = require('../services/userService');
const router = express.Router();

// Endpoint de prueba para verificar que la ruta funciona
router.get('/', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const basicAuthString = authHeader && authHeader.split(' ')[1];

  if (!basicAuthString) {
    return res.sendStatus(HTTPErrorCodes.Unauthorized);
  }

  // Decodificamos el string de autorización
  const [username, password] = Buffer.from(basicAuthString, 'base64').toString().split(':');

  // Validamos contra la DB

  try {
    let savedPassword = await getUserPassword(username); // Esperamos la resolución de la promesa
    let hashedPassword = await bcrypt.hash(savedPassword, saltRounds); // Esperamos la resolución de la promesa

    if (await bcrypt.compare(password, hashedPassword)) { // Comparamos los hashes usando bcrypt.compare
      res.json(generateTokens(username, password));
    } else {
      res.sendStatus(HTTPErrorCodes.Unauthorized);
    }
  } catch (error) {
    // Aquí manejas el error si ocurrió algún problema durante la llamada a getUserPassword
    res.json({ error: 'Error de contraseña' });
  }
});

export default router;

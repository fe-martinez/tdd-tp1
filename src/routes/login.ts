import express, { Request, Response } from 'express';
import { generateTokens } from '../middleware/jwt';
import HTTPErrorCodes from '../utilities/httpErrorCodes';

const router = express.Router();

// Endpoint de prueba para verificar que la ruta funciona
router.get('/', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const basicAuthString = authHeader && authHeader.split(' ')[1];

  if (!basicAuthString) {
    return res.sendStatus(HTTPErrorCodes.Unauthorized);
  }

  // Decodificamos el string de autorización
  const [username, password] = Buffer.from(basicAuthString, 'base64').toString().split(':');

  // Validamos contra la DB

  // Si las credenciales son válidas, generamos un token JWT y un refresh token
  res.json(generateTokens(username, password));
});

export default router;


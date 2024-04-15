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
    return res.sendStatus(HTTPErrorCodes.Unauthorized).json({ error: "Email not found in db" });;
  }

  // Decodificamos el string de autorización
  const [username, password] = Buffer.from(basicAuthString, 'base64').toString().split(':');

  // Validamos contra la DB
  try {
    const savedPassword = await userService.getUserPassword(username);
    if (await bcrypt.compare(password, savedPassword.toString())) {
      return res.json(generateTokens(username, password));
    } else {
      return res.status(HTTPErrorCodes.Unauthorized).json({error: "Password is not correct"});
    }
  } catch (err) {
      let errMessage: string = "Error when searching in database"
      if(err instanceof Error) {
        errMessage = err.message;
      }
      return res.status(HTTPErrorCodes.InternalServerError).json({message: 'Error during login', error: errMessage})
  }
});

export default router;

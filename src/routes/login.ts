import express from 'express';

import controller from '../controllers/login';
import { refreshToken } from '../middleware/jwt';
const router = express.Router();

// Endpoint de prueba para verificar que la ruta funciona
router.post('/', controller.login);
router.post('/refresh', refreshToken);

export default router;

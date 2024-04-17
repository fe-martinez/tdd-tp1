import express from 'express';

import controller from '../controllers/login';
import jwt from '../middleware/jwt';
const router = express.Router();

// Endpoint de prueba para verificar que la ruta funciona
router.post('/', controller.login);
router.post('/refresh', jwt.refreshToken);

export default router;

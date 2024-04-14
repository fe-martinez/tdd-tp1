import express, { Request, Response } from 'express';

const router = express.Router();

// Endpoint de prueba para verificar que la ruta funciona
router.get('/', (req: Request, res: Response) => {
  res.send('¡La ruta de inicio de sesión está funcionando correctamente!');
});

export default router;

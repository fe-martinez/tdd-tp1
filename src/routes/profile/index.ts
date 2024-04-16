import express, { Request, Response } from 'express';
import { authenticateToken } from '../../middleware/jwt';

const router = express.Router();


router.post("/profile/image", authenticateToken, async (req: Request, res: Response) => {
    res.status(400).send('No se ha enviado ninguna imagen.');
});

export default router;
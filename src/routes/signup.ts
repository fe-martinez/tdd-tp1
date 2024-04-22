import express from 'express';
import controller from '../controllers/signup';

const router = express.Router();

router.post('/', controller.signup);

export default router;
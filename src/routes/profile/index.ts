import express from 'express';
import { authenticateToken } from '../../middleware/jwt';
import multer from 'multer';
import controller from '../../controllers/profile';

const router = express.Router();
const upload = multer();

router.post('/photo', upload.single('photo'), authenticateToken, controller.updatePhoto);
router.get('/photo', authenticateToken, controller.getProfilePhoto);
router.delete('/photo', authenticateToken, controller.deletePhoto);

export default router;
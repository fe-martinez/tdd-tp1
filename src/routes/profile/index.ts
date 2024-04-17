import express from 'express';
import jwt from '../../middleware/jwt';
import multer from 'multer';
import controller from '../../controllers/profile';

const router = express.Router();
const upload = multer();

router.get('/', jwt.authenticateToken, controller.getProfile);
router.post('/photo', upload.single('photo'), jwt.authenticateToken, controller.updatePhoto);
router.get('/photo', jwt.authenticateToken, controller.getProfilePhoto);
router.delete('/photo', jwt.authenticateToken, controller.deletePhoto);

export default router;
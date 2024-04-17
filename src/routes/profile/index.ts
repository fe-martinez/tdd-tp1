import express from 'express';
import jwt from '../../middleware/jwt';
import multer from 'multer';
import controller from '../../controllers/profile';

const router = express.Router();
const upload = multer();

router.get('/', jwt.authenticateToken, controller.getProfile);
router.post('/photo', upload.single('photo'), jwt.authenticateToken, controller.updateProfilePhoto);
router.get('/photo', jwt.authenticateToken, controller.getProfilePhoto);
router.delete('/photo', jwt.authenticateToken, controller.deleteProfilePhoto);
router.patch('/', jwt.authenticateToken, controller.updateProfile);

router.get('/followers', jwt.authenticateToken, controller.getFollowers);
router.get('/following', jwt.authenticateToken, controller.getFollowing);

export default router;
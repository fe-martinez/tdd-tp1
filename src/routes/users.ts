import express, { Request, Response } from 'express';
import { UserService } from '../services/userService';

//import { User } from '../../model/user';
import controller from '../controllers/users';
import jwt from '../middleware/jwt';

const router = express.Router();
const userService = new UserService();

router.get('/', jwt.authenticateToken, controller.getAllUsers);
router.get('/:id/profile', jwt.authenticateToken, controller.getUserProfileById);
router.post('/:id/follow', jwt.authenticateToken, controller.followUser);
router.delete('/:id/follow', jwt.authenticateToken, controller.unfollowUser);
router.get('/:id/profile/followers', jwt.authenticateToken, controller.getOtherUserFollowers);
router.get('/:id/profile/following', jwt.authenticateToken, controller.getOtherUserFollowing);
router.get('/hobbies' ,controller.getAllHobbies);
router.get('/genders' ,controller.getAllGenders);
export default router;

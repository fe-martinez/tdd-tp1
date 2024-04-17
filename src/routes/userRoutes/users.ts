import express, { Request, Response } from 'express';
import { UserService } from '../../services/userService';
import controller from '../../controllers/users';
import jwt from '../../middleware/jwt';

const router = express.Router();
const userService = new UserService();

router.get('/', jwt.authenticateToken, controller.getAllUsers);
router.get('/:id/profile', jwt.authenticateToken, controller.getUserProfileById);

router.post('/follow', async (req: Request, res: Response) => {
  try {

    const user = await userService.getUserById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userIdToFollow = req.body.userIdToFollow;

    const followerUserId = user.id;

    const followedUser = await userService.followUser(userIdToFollow, followerUserId);

    res.json(followedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al seguir al usuario', error: (error as Error).message });
  }
});

export default router;

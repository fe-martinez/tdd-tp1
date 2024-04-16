import express, { Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { authenticateToken, refreshToken } from '../../middleware/jwt';

//import { User } from '../../model/user';

const router = express.Router();
const userService = new UserService();

// Async permite una sintaxis mas linda para trabajar con Promises
// Ahora, no se si es lo correcto o no usarlo asi.
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error getting users', error: err });
  }
});

router.get('/:userId/profile', async (req: Request, res: Response) => {
  try {
      const userId = parseInt(req.params.userId);
      const user = await userService.getUserById(userId);
      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error while getting user', error: (error as Error).message });
  }
});

router.post('/follow', authenticateToken,async (req: Request, res: Response) => {
  try {
  
    const userIdToFollow =req.body.user.id;  ;

    const followerUserId = req.body.userIdToFollow;

    const followedUser = await userService.followUser(userIdToFollow, followerUserId);
    
    res.json(followedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al seguir al usuario', error: (error as Error).message });
  }
});

export default router;

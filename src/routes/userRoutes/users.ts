import express, { Request, Response } from 'express';
import { UserService } from '../../services/userService';

//import { User } from '../../model/user';
import controller from '../../controllers/users';
import jwt from '../../middleware/jwt';

const router = express.Router();
const userService = new UserService();

router.get('/', jwt.authenticateToken, controller.getAllUsers);
router.get('/:id/profile', jwt.authenticateToken, controller.getUserProfileById);

router.post('/follow', jwt.authenticateToken, async (req: Request, res: Response) => {
  try {
    const userIdToFollow = parseInt(req.params.id);
    const followerUserId = req.body.user.id;
    const followedUser = await userService.followUser(followerUserId, userIdToFollow);
    console.log(followedUser);
    res.json(followedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al seguir al usuario', error: (error as Error).message });
  }
});

router.delete('/:id/follow', jwt.authenticateToken, async (req: Request, res: Response) => {
  try {
    const userIdToUnfollow = parseInt(req.params.id);
      const followerUserId = req.body.user.id;
      await userService.unfollowUser(followerUserId, userIdToUnfollow);
      res.status(200).json({ message: 'Unfollow successful' });
  } catch (error) {
      res.status(500).json({ message: 'Error al dejar de seguir al usuario', error: (error as Error).message });
  }
});

// router.get('/followers', authenticateToken, async (req: Request, res: Response) => {
//   try {
//       const userId = req.body.user.id; 

//       const followers = await userService.getFollowersByUserId(userId);

//       res.json(followers);
//   } catch (error) {
//       res.status(500).json({ message: 'Error al obtener los seguidores', error: (error as Error).message });
//   }
// });

// router.get('/following', authenticateToken, async (req: Request, res: Response) => {
//   try {
//       const userId = req.body.user.id;
//       const followingUsers = await userService.getFollowingByUserId(userId);
//       res.json(followingUsers);
//   } catch (error) {
//       res.status(500).json({ message: 'Error al obtener los usuarios seguidos', error: (error as Error).message });
//   }
// });

export default router;

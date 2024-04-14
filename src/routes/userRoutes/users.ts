import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  let users = [{ name: 'John' }, { name: 'Jane' }];
  res.send(users);
});

export default router;

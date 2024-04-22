import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { userValidSchema } from '../model/userValidSchema';
import HTTPErrorCodes from '../utilities/httpErrorCodes';
import HTTPSuccessCodes from '../utilities/httpSuccessCodes';

async function signup(req: Request, res: Response) {
    const { error } = userValidSchema.validate(req.body);
    if (error) {
        return res.status(HTTPErrorCodes.BadRequest).json({ message: error.message });
    }

    try {
        const newUser = await new UserService().parseUser(req.body);
        const created = await new UserService().createUser(newUser);
        res.status(HTTPSuccessCodes.CREATED).json(created);
    } catch {
        res.status(HTTPErrorCodes.BadRequest).json({ message: 'Error while creating new user' });
    }
}

export default { signup };
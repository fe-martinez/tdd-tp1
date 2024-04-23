import HTTPErrorCodes from "../utilities/httpErrorCodes";
import { Request, Response } from 'express';
import jwt from '../middleware/jwt'
import bcrypt from 'bcrypt';
import { UserService } from '../services/userService';
import { UserNotExistsError } from "../services/user/errors";

function parseAuthorizationHeader(authHeader: string | undefined) {
    const base64String = authHeader && authHeader.split(' ')[1];
    if (!base64String) return {};
    const [username, password] = Buffer.from(base64String, 'base64').toString().split(':');
    return { username, password };
}

function login(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const { username, password } = parseAuthorizationHeader(authHeader);
    if (!username || !password) {
        return res.sendStatus(HTTPErrorCodes.Forbidden);
    }

    new UserService()
        .login(username, password)
        .then(tokens => res.json(tokens))
        .catch((err: Error) => {
            if (err instanceof UserNotExistsError) {
                return res.status(HTTPErrorCodes.NotFound).send(err.message);
            }
            res.status(HTTPErrorCodes.Forbidden).send(err.message);
        });
}


export default { login };
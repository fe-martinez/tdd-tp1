import HTTPErrorCodes from "../utilities/httpErrorCodes";
import { Request, Response } from 'express';
import jwt from '../middleware/jwt'
import bcrypt from 'bcrypt';
import { UserService } from '../services/userService';

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
        .getUserByEmail(username)
        .then(user => {
            if (!user)
                return res.status(HTTPErrorCodes.NotFound).json({ error: "User not found" });

            const userPassword = user.password.toString();
            return bcrypt.compare(password, userPassword)
            .then(equal => {
                if (!equal)
                    return res.status(HTTPErrorCodes.Unauthorized).json({ error: "Password is not correct" });

                const tokens = jwt.generateTokens(user.id, user.email.toString());
                return res.json(tokens);
            })
        })
        .catch(err => {
            const errMessage: string = err.message || "Database error";
            return res.status(HTTPErrorCodes.InternalServerError).json({ message: 'Error during login', error: errMessage })
        });
}


export default { login };
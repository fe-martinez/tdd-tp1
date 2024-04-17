import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HTTPErrorCodes from '../utilities/httpErrorCodes';

const secretKey = 'tu_clave_secreta'; // Reemplaza esto con tu clave secreta
const refreshTokens: string[] = []; // Almacena los refresh tokens válidos
const accessTokenExpirationTime = 300; // 5 minutos

function generateAccessToken(id: number, email: string): string {
    return jwt.sign({ id, email }, secretKey, { expiresIn: accessTokenExpirationTime });
}

function generateRefreshToken(id: number, email: string): string {
    const refreshToken = jwt.sign({ id, email }, secretKey); // No especificamos tiempo de expiración
    refreshTokens.push(refreshToken); // Almacenamos el refresh token válido
    return refreshToken;
}

function consumeRefreshToken(token: string) {
    const index = refreshTokens.indexOf(token);
    if (index !== -1) {
        refreshTokens.splice(index, 1);
    }
}

function generateTokens(id: number, email: string) {
    const accessToken = generateAccessToken(id, email);
    const refreshToken = generateRefreshToken(id, email);
    return { accessToken, refreshToken };
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = parseAuthorizationHeader(authHeader);

    if (!token || refreshTokens.includes(token)) {
        return res.sendStatus(HTTPErrorCodes.Unauthorized);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err && err.name === 'TokenExpiredError') {
            return res.status(HTTPErrorCodes.Unauthorized).json('Token Expired')
        }

        if (err || !user) {
            return res.sendStatus(HTTPErrorCodes.Forbidden);
        }

        req.body.user = user;
        next();
    });
}

function refreshToken(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const token = parseAuthorizationHeader(authHeader);

    if (!token || !refreshTokens.includes(token)) {
        return res.sendStatus(HTTPErrorCodes.Unauthorized);
    }

    jwt.verify(token, secretKey, (err, user: any) => {
        if (err || !user) {
            return res.sendStatus(HTTPErrorCodes.Forbidden);
        }

        consumeRefreshToken(token);

        res.json(generateTokens(user.id, user.email));
    });
}

function parseAuthorizationHeader(authHeader: string | undefined) {
    return authHeader && authHeader.split(' ')[1];
}

export default { generateTokens, authenticateToken, refreshToken };

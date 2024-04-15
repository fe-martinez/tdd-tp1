import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HTTPErrorCodes from '../utilities/httpErrorCodes';

const secretKey = 'tu_clave_secreta'; // Reemplaza esto con tu clave secreta
const refreshTokens: string[] = []; // Almacena los refresh tokens válidos

// Función para generar un token de acceso
function generateAccessToken(username: string, password: string): string {
    return jwt.sign({ username, password }, secretKey, { expiresIn: 15 }); // Token expira en 15 segundos
}

// Función para generar un refresh token
function generateRefreshToken(username: string, password: string): string {
    const refreshToken = jwt.sign({ username, password }, secretKey); // No especificamos tiempo de expiración
    refreshTokens.push(refreshToken); // Almacenamos el refresh token válido
    return refreshToken;
}

function generateTokens(username: string, password: string) {
    const accessToken = generateAccessToken(username, password);
    const refreshToken = generateRefreshToken(username, password);
    return { accessToken, refreshToken };
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || refreshTokens.includes(token)) {
        return res.sendStatus(HTTPErrorCodes.Unauthorized);
    }

    jwt.verify(token, secretKey, (err, user: any) => {
        if (err && err.name === 'TokenExpiredError') {
            return res.status(HTTPErrorCodes.Unauthorized).json('Token Expired')
        }

        if (err || !user) {
            return res.sendStatus(HTTPErrorCodes.Forbidden);
        }

        req.body.username = user.username; 
        next();
    });
}

function refreshToken(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.body?.refreshToken;

    if (!token || !refreshTokens.includes(token)) {
        return res.sendStatus(HTTPErrorCodes.Unauthorized);
    }

    jwt.verify(token, secretKey, (err, user: any) => {
        if (err || !user) {
            return res.sendStatus(HTTPErrorCodes.Forbidden);
        }

        const index = refreshTokens.indexOf(token);
        if (index !== -1) {
            refreshTokens.splice(index, 1);
        }

        res.json(generateTokens(user.username, user.password));
    });
}


export { generateTokens, authenticateToken, refreshToken };
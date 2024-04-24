import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HTTPErrorCodes from '../utilities/httpErrorCodes';
import { Token, TokenInfo } from '../model/token';
import { InvalidTokenError } from './errors';
import 'dotenv/config';

const secretKey = process.env.JWT_SECRET_KEY || "secret";
const accessTokenExpirationTime = process.env.JWT_EXPIRATION_TIME || "5m";
const refreshTokens: string[] = []; // Almacena los refresh tokens válidos

function generateAccessToken(id: number, email: string): string {
    return jwt.sign({ id, email, isRefresh: false }, secretKey, { expiresIn: accessTokenExpirationTime });
}

function generateRefreshToken(id: number, email: string): string {
    const refreshToken = jwt.sign({ id, email, isRefresh: true, date: Date.now() }, secretKey); // No especificamos tiempo de expiración
    refreshTokens.push(refreshToken); // Almacenamos el refresh token válido
    return refreshToken;
}

function consumeRefreshToken(token: string) {
    const index = refreshTokens.indexOf(token);
    if (index !== -1) {
        refreshTokens.splice(index, 1);
    }
}

function generateTokens(id: number, email: string): Token {
    const accessToken = generateAccessToken(id, email);
    const refreshToken = generateRefreshToken(id, email);
    return { accessToken, refreshToken } as Token;
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = parseAuthorizationHeader(authHeader);

    if (!token) {
        return res.sendStatus(HTTPErrorCodes.Unauthorized);
    }

    try {
        const tokenInfo = verifyAccessToken(token);
        req.body.user = tokenInfo;
        next();
    } catch (error) {
        if (error instanceof InvalidTokenError) {
            return res.sendStatus(HTTPErrorCodes.Forbidden);
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(HTTPErrorCodes.Unauthorized).json('Token Expired');
        }
        return res.sendStatus(HTTPErrorCodes.InternalServerError);
    }
}

function refreshToken(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const token = parseAuthorizationHeader(authHeader);

    if (!token) {
        return res.sendStatus(HTTPErrorCodes.Unauthorized);
    }

    try {
        const tokenInfo = verifyRefreshToken(token);
        const newTokens = generateTokens(tokenInfo.id, tokenInfo.email);
        return res.json(newTokens);
    } catch (error) {
        if (error instanceof InvalidTokenError) {
            return res.sendStatus(HTTPErrorCodes.Forbidden);
        }
        return res.sendStatus(HTTPErrorCodes.InternalServerError);
    }

}

function parseAuthorizationHeader(authHeader: string | undefined) {
    return authHeader && authHeader.split(' ')[1];
}

function verifyToken(token: string): TokenInfo {
    try {
        return jwt.verify(token, secretKey) as TokenInfo;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError)
            throw error;
        throw new InvalidTokenError();
    }
}

function verifyAccessToken(token: string): TokenInfo {
    const tokenInfo = verifyToken(token);
    if (tokenInfo.isRefresh) {
        throw new InvalidTokenError();
    }
    return tokenInfo;
}

function verifyRefreshToken(token: string): TokenInfo {
    const tokenInfo = verifyToken(token);
    if (!tokenInfo.isRefresh || !refreshTokens.includes(token)) {
        throw new InvalidTokenError();
    }
    consumeRefreshToken(token);
    return tokenInfo;
}


export default {
    generateTokens,
    authenticateToken,
    refreshToken,
    verifyAccessToken,
    verifyRefreshToken
};

import jwt from './jwt';
import { InvalidTokenError } from './errors';

const MAIL: string = 'mail@mail.com';

describe('when jwt generate tokens', () => {
    it('should return access and refresh tokens', () => {
        const token = jwt.generateTokens(1, MAIL);
        expect(token.accessToken).toBeDefined();
        expect(token.refreshToken).toBeDefined();
    });
});

describe('when verify valid tokens', () => {
    it('access token should return initial info', () => {
        const { accessToken } = jwt.generateTokens(1, MAIL);
        const tokenInfo = jwt.verifyAccessToken(accessToken);
        expect(tokenInfo).toBeDefined();
        expect(tokenInfo.id).toBe(1);
        expect(tokenInfo.email).toBe(MAIL);
    })
    it('refresh token should return initial info', () => {
        const { refreshToken } = jwt.generateTokens(1, MAIL);
        const tokenInfo = jwt.verifyRefreshToken(refreshToken);
        expect(tokenInfo).toBeDefined();
        expect(tokenInfo.id).toBe(1);
        expect(tokenInfo.email).toBe(MAIL);
    })
});

describe('when verify invalid token', () => {
    it('should throw error', () => {
        const verifyInvalid = () => jwt.verifyAccessToken("invalid");
        expect(verifyInvalid).toThrow(InvalidTokenError);
    })
});

describe('when verify access token as refresh token', () => {
    it('should throw error', () => {
        const { accessToken } = jwt.generateTokens(1, MAIL);
        const verifyRefresh = () => jwt.verifyRefreshToken(accessToken);
        expect(verifyRefresh).toThrow(InvalidTokenError);
    })
});

describe('when verify refresh token as access token', () => {
    it('should throw error', () => {
        const { refreshToken } = jwt.generateTokens(1, MAIL);
        const verifyRefresh = () => jwt.verifyAccessToken(refreshToken);
        expect(verifyRefresh).toThrow(InvalidTokenError);
    })
});

describe('when verify same refresh token twice', () => {
    it('should throw error', () => {
        const { refreshToken } = jwt.generateTokens(1, MAIL);
        jwt.verifyRefreshToken(refreshToken);
        const verifyRefresh = () => jwt.verifyRefreshToken(refreshToken);
        expect(verifyRefresh).toThrow(InvalidTokenError);
    })
});
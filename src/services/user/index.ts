import { User } from '../../model/user';
import { UserSQLiteManager } from '../../database/databaseManager';
import bcrypt from 'bcrypt'
import { Gender } from '../../model/gender';
import { Hobby } from '../../model/hobby';
import { PhotoUploader } from './../photoUploader';
import { Token } from '../../model/token';
import { UserIncorrectPasswordError, UserNotExistsError, AlreadyFollowingError } from './../user/errors';
import jwt from '../../middleware/jwt';
const saltRounds = 10;

export class UserService {
    private sqliteManager: UserSQLiteManager;

    constructor() {
        this.sqliteManager = new UserSQLiteManager();
    }

    async parseUser(reqBody: any): Promise<Omit<User, 'id'>> {
        try {
            return {
                firstName: reqBody.firstName,
                lastName: reqBody.lastName,
                email: reqBody.email,
                password: await bcrypt.hash(reqBody.password, saltRounds),
                photo: '',
                birthDate: reqBody.birthDate,
                gender: reqBody.gender,
                hobbies: reqBody.hobbies
            }
        } catch {
            throw new Error('Error while parsing user');
        }
    }

    async getUsers(firstName?: string, lastName?: string, hobby?: number, page?: number): Promise<Omit<User, 'password'>[]> {
        return this.sqliteManager.getUsers(firstName, lastName, hobby, page);
    }

    async getUserById(userId: number): Promise<Omit<User, 'password'> | null> {
        return this.sqliteManager.getUserById(userId);
    }

    async insertUserHobbies(userID: Number, hobbies: string[]): Promise<void> {
        hobbies.forEach(hobby => this.sqliteManager.insertHobby(userID, hobby))
    }

    async createUser(user: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
        const createdUser = await this.sqliteManager.createUser(user);
        await this.insertUserHobbies(createdUser.id, createdUser.hobbies);
        return createdUser;
    }

    async followUser(followerId: number, followedId: number): Promise<Omit<User, 'password'>> {
        return this.sqliteManager.checkIfAlreadyFollowing(followerId, followedId)
            .then(alreadyFollowing => {
                if (alreadyFollowing)
                    return Promise.reject(new AlreadyFollowingError())
                return this.sqliteManager.followUser(followerId, followedId)
            })
    }

    async getFollowersByUserId(userId: number): Promise<Omit<User, 'password'>[]> {
        try {
            const followers = await this.sqliteManager.getFollowersByUserId(userId);
            return followers;
        } catch (error) {
            throw new Error('Error while getting followers by user ID: ' + error);
        }
    }

    async unfollowUser(followerId: number, userIdToUnfollow: number): Promise<void> {
        try {
            await this.sqliteManager.unfollowUser(followerId, userIdToUnfollow);
            return Promise.resolve();
        } catch (err) {
            return Promise.reject('Error while unfollowing user: ' + err);
        }
    }

    async getFollowingByUserId(userId: number): Promise<Omit<User, 'password'>[]> {
        return this.sqliteManager.getFollowingByUserId(userId);
    }

    async getUserByEmail(email: String): Promise<User | null> {
        return this.sqliteManager.getUserByEmail(email)
    }

    async updatePhoto(userId: number, file: Buffer, filename: string): Promise<void> {
        return new PhotoUploader(file, filename)
            .uploadPhoto()
            .then(async (path) => this.sqliteManager.updatePhoto(userId, path))
    }

    async deletePhoto(userId: number): Promise<void> {
        return this.sqliteManager.updatePhoto(userId, "");
    }

    async getAllHobbies(): Promise<Hobby[]> {
        return await this.sqliteManager.getAllHobbies();
    }

    async getAllGenders(): Promise<string[]> {
        return Object.values(Gender) as string[];
    }

    async login(email: string, password: string): Promise<Token> {
        return this.getUserByEmail(email)
            .then(user => !user ? Promise.reject(new UserNotExistsError()) : user)
            .then(async user => bcrypt.compare(password, user.password as string)
                .then(equal => !equal ? Promise.reject(new UserIncorrectPasswordError()) : jwt.generateTokens(user.id, user.email as string)));
    }

    async userExists(id: number): Promise<boolean> {
        return this.sqliteManager.userExists(id);
    }
}
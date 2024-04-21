import { User } from '../model/user';
import { UserSQLiteManager } from '../database/databaseManager';
import bcrypt from 'bcrypt'
import { Gender } from '../model/gender';
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

    async getUsers(firstName?: string, lastName?: string, hobby?: Number, page?: number): Promise<User[]> {
        try {
            let users = await this.sqliteManager.getUsers(firstName, lastName, hobby, page);
            return users;
        } catch (err) {
            throw err;
        }
    }

    async getUserById(userId: number): Promise<User | null> {
        try {
            return await this.sqliteManager.getUserById(userId);
        } catch (err) {
            throw err;
        }
    }

    async insertUserHobbies(userID: Number, hobbies: string[]): Promise<void> {
        try {
            hobbies.forEach(hobby => {
                this.sqliteManager.insertHobby(userID, hobby);
            })
        } catch(err) {
            throw(err);
        }
    }


    async createUser(user: Omit<User, 'id'>): Promise<User> {
        try {
            const createdUser = await this.sqliteManager.createUser(user);
            await this.insertUserHobbies(createdUser.id, createdUser.hobbies);  
            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async followUser(userIdToFollow: number, followerUserId: number): Promise<User> {
        try {
            return await this.sqliteManager.followUser(userIdToFollow, followerUserId);
        } catch (err) {
            throw new Error('Error while following user: ' + err);
        }
    }

    async getFollowersByUserId(userId: number): Promise<User[]> {
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
            throw new Error('Error while unfollowing user: ' + err);
        }
    }

    async getFollowingByUserId(userId: number): Promise<User[]> {
        try {
            return await this.sqliteManager.getFollowingByUserId(userId);
        } catch (error) {
            throw error;
        }
    }

    async getUserPassword(email: String): Promise<String> {
        try {
            const user = await this.sqliteManager.getEmailRow(email);
            if (user) {
                return user.password;
            } else {
                throw new Error('Email not found in the db');
            }
        } catch (err) {
            throw err;
        }
    }

    async changeUserEmailById(id: number, email: string) {
        try {
            await this.sqliteManager.changeEmailbyId(id, email);
        } catch (err) {
            throw err;
        }
    }

    async changeUserFirstNameById(id: number, firstName : string) {
        try {
            await this.sqliteManager.changeFirstNamebyId(id, firstName);
        } catch (err) {
            throw err;
        }
    }

    async changeUserGenderById(id: number, gender : string) {
        try {
            await this.sqliteManager.changeGenderbyId(id, gender);
        } catch (err) {
            throw err;
        }
    }

    async changeUserPasswordById(id: number, newPassword : string) {
        try {
            let hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            await this.sqliteManager.changePasswordbyId(id, hashedPassword);
        } catch (err) {
            throw err;
        }
    }

    async getUserByEmail(email: String): Promise<User | null> {
        return this.sqliteManager.getUserByEmail(email)
    }

    async updatePhoto(userId: number, photo: string): Promise<void> {
        return this.sqliteManager.updatePhoto(userId, photo);
    }

    async getAllHobbies(): Promise<string[]> {
        try {
            const hobbies = await this.sqliteManager.getAllHobbies();
            return hobbies;
        } catch (err) {
            throw err;
        }
    }
    async getAllGenders(): Promise<string[]> {
        try {
            const genders = Object.values(Gender);
            return genders;
        } catch (err) {
            throw err;
        }
    }
}
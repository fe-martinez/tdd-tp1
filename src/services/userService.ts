import { User } from '../model/user';
import { UserSQLiteManager } from '../database/databaseManager';
export class UserService {
    private sqliteManager: UserSQLiteManager;

    constructor() {
        this.sqliteManager = new UserSQLiteManager();
    }

    async getAllUsers(): Promise<User[]> {
        try {
            return await this.sqliteManager.getAllUsers();
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


    async createUser(user: Omit<User, 'id'>): Promise<User> {
        try {
            return await this.sqliteManager.createUser(user);
        } catch (err) {
            throw err;
        }
    }

    async followUser(userIdToFollow: number, followerUserId: number): Promise<void> {
        try {
            await this.sqliteManager.followUser(userIdToFollow, followerUserId);
            return Promise.resolve();
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

    async getUserByEmail(email: String): Promise<User | null> {
        return this.sqliteManager.getUserByEmail(email)
    }
}
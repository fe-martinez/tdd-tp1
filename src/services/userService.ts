import {User} from '../model/user';
import {UserSQLiteManager} from '../database/databaseManager';
export class UserService {
    private sqliteManager: UserSQLiteManager;

    constructor() {
        this.sqliteManager = new UserSQLiteManager();
    }

    async getAllUsers(): Promise<User[]> {
        try {
            return await this.sqliteManager.getAllUsers();
        } catch (err) {
            throw new Error('Error while getting users: ' + err);
        }
    }

    async createUser(user: Omit<User, 'id'>): Promise<User> {
        try {
            return await this.sqliteManager.createUser(user);
        } catch(err) {
            throw new Error('Error while creating user: ' + err);
        }
    }

    async getUserPassword(email: String): Promise<String> {
        try {
            const password = (await this.sqliteManager.getEmailRow(email)).password;
            return password;
        } catch(err) {
            throw new Error('Error while reading user: ' + err);
        }
    }
}
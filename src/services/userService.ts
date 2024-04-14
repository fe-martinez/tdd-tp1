import {User} from '../database/databaseManager';
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
}
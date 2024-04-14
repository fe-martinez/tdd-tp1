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

    async getUserById(userId: number): Promise<User | null> {
        try {
            return await this.sqliteManager.getUserById(userId);
        } catch (err) {
            throw new Error('Error while getting user by id: ' + err);
        }
    }
    

    async createUser(user: Omit<User, 'id'>): Promise<User> {
        try {
            return await this.sqliteManager.createUser(user);
        } catch(err) {
            throw new Error('Error while creating user: ' + err);
        }
    }
    async followUser(userIdToFollow: number, followerUserId: number): Promise<void> {
        try {
            // Llama a la función followUser de sqliteManager para agregar la relación de seguidor a seguido.
            await this.sqliteManager.followUser(userIdToFollow, followerUserId);
            // Si todo salió bien, simplemente resuelve la promesa sin devolver ningún valor específico.
            return Promise.resolve();
        } catch(err) {
            // En caso de error, lanza una excepción con un mensaje descriptivo.
            throw new Error('Error while following user: ' + err);
        }
    }
    
}
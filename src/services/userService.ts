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

    async getUsers(firstName?: string, lastName?: string, hobby?: Number): Promise<User[]> {
        try {
            let users = await this.sqliteManager.getUsers(firstName, lastName, hobby);
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

    async insertUserHobbies(userID: Number, hobbies: Number[]): Promise<void> {
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

    async followUser(userIdToFollow: number, followerUserId: number): Promise<void> {
        try {
            // Llama a la función followUser de sqliteManager para agregar la relación de seguidor a seguido.
            await this.sqliteManager.followUser(userIdToFollow, followerUserId);
            // Si todo salió bien, simplemente resuelve la promesa sin devolver ningún valor específico.
            return Promise.resolve();
        } catch (err) {
            // En caso de error, lanza una excepción con un mensaje descriptivo.
            throw new Error('Error while following user: ' + err);
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
}
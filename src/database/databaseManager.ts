import sqlite3, { Database } from "sqlite3";
import * as userQueries from './userQueries';
import { User } from '../model/user'; 

export class UserSQLiteManager {
    private db: Database;

    constructor() {
        this.db = new sqlite3.Database('db/users.db');
        this.createTables();
    }

    private createTables() {
        const createHobbiesTableQuery = userQueries.createHobbiesTableQuery;
        const createUserHobbiesTableQuery = userQueries.createUserHobbiesTableQuery;
        const createUserFollowsTableQuery = userQueries.createUserFollowsTableQuery;

        const createUserTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                firstName TEXT,
                lastName TEXT,
                email TEXT UNIQUE,
                photo TEXT,
                birthDate TEXT,
                gender TEXT
            )
        `;

        this.db.run(createUserTableQuery);
        this.db.run(createHobbiesTableQuery);
        this.db.run(createUserHobbiesTableQuery);
        this.db.run(createUserFollowsTableQuery);

        const insertHobbiesQuery = `
            INSERT OR IGNORE INTO hobbies (name) VALUES (?)
        `;

        userQueries.availableHobbies.forEach(hobby => {
            this.db.run(insertHobbiesQuery, [hobby]);
        });
    }

    createUser(user: Omit<User, 'id'>): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.run(userQueries.createUser, [user.firstName, user.lastName, user.email, user.password, user.photo, user.birthDate, user.gender], 
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            password: user.password,
                            photo: user.photo,
                            birthDate: user.birthDate,
                            gender: user.gender
                        });
                    }
                });
        });
    }

    getAllUsers(): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            const query = `SELECT * FROM users`;
            this.db.all(query, [], (err, rows: User[]) => { 
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    getUserById(userId: number): Promise<User | null> {
        return new Promise<User | null>((resolve, reject) => {
            const query = `SELECT * FROM users WHERE id = ?`;
            this.db.get(query, [userId], (err, row: User | undefined) => { 
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        const user: User = {
                            id: row.id,
                            firstName: row.firstName,
                            lastName: row.lastName,
                            email: row.email,
                            password: row.password,
                            photo: row.photo,
                            birthDate: new Date(row.birthDate),
                            gender: row.gender,
                        };
                        resolve(user);
                    } else {
                        resolve(null); // Si no se encuentra el usuario, devuelve null
                    }
                }
            });
        });
    }
    
    async followUser(followerId: number, followedId: number): Promise<User> {
        const insertFollowQuery = `
            INSERT INTO user_follows (follower_id, followed_id) VALUES (?, ?)
        `;
    
        await new Promise<void>((resolve, reject) => {
            this.db.run(insertFollowQuery, [followerId, followedId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    
        const getUserQuery = `
            SELECT * FROM users WHERE id = ?
        `;
    
        return new Promise<User>((resolve, reject) => {
            this.db.get(getUserQuery, [followedId], (err, row: User | undefined) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    reject(new Error('User not found'));
                } else {
                    const user: User = {
                        id: row.id,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        email: row.email,
                        password: row.password,
                        photo: row.photo,
                        birthDate: new Date(row.birthDate),
                        gender: row.gender,
                    };
                    resolve(user);
                }
            });
        });
    }

    getEmailRow(email: String): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.get(userQueries.getPassword, [email], (err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row as User);
                }
            });
        });
    }
}

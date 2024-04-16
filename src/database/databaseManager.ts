import sqlite3, { Database } from "sqlite3";
import * as userQueries from './userQueries';
import * as dbCreationQueries from './dbCreationQueries'
import { User } from '../model/user';

export class UserSQLiteManager {
    private db: Database;

    constructor() {
        this.db = new sqlite3.Database('db/users.db');
        this.createTables();
    }

    private createTables() {
        this.db.serialize(() => {
            this.db.run(dbCreationQueries.createUserTableQuery);
            this.db.run(dbCreationQueries.createHobbiesTableQuery);
            this.db.run(dbCreationQueries.createUserHobbiesTableQuery);
            this.db.run(dbCreationQueries.createUserFollowsTableQuery);
            dbCreationQueries.availableHobbies.forEach(hobby => {
                this.db.run(dbCreationQueries.insertHobbiesQuery, [hobby]);
            });
        });
    }

    insertHobby(userID: Number, hobby: Number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run(userQueries.insertHobby, [userID, hobby], (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
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
                            gender: user.gender,
                            hobbies: user.hobbies
                        });
                    }
                });
        });
    }

    getAllUsers(): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.db.all(userQueries.getAllUsers, [], (err, rows: User[]) => {
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
            this.db.get(userQueries.getUserById, [userId], (err, row: User | undefined) => {
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
                            hobbies: []
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
        await new Promise<void>((resolve, reject) => {
            this.db.run(userQueries.insertFollowQuery, [followerId, followedId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return new Promise<User>((resolve, reject) => {
            this.db.get(userQueries.getUserById, [followedId], (err, row: User | undefined) => {
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
                        hobbies: []
                    };
                    resolve(user);
                }
            });
        });
    }

    getEmailRow(email: String): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.get(userQueries.getPassword, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row as User);
                }
            });
        });
    }

    getUserByEmail(email: String): Promise<User | null> {
        return new Promise<User | null>((resolve, reject) => {
            this.db.get(userQueries.getUserByEmail,
                [email],
                (err, row: User | undefined) => err ? reject(err) : resolve(row as User || null))
        })
    }
}

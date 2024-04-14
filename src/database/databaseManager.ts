import sqlite3, { Database } from "sqlite3";
import * as userQueries from './userQueries';
import { createHobbiesTableQuery, createUserHobbiesTableQuery } from './userQueries';

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: String,
    photo: string,
    birthDate: Date,
    gender: string, // "male" | "female" | "other"
    hobbies: string[]
}
export class UserSQLiteManager {
    private db: Database;

    constructor() {
        this.db = new sqlite3.Database('db/users.db');
        this.createTables();
    }

    private createTables() {
        const createHobbiesTableQuery = userQueries.createHobbiesTableQuery;
        const createUserHobbiesTableQuery = userQueries.createUserHobbiesTableQuery;

        // Crear la tabla de usuarios
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

        // Ejecutar las consultas para crear las tablas
        this.db.run(createUserTableQuery);
        this.db.run(createHobbiesTableQuery);
        this.db.run(createUserHobbiesTableQuery);
    }

    createUser(user: Omit<User, 'id'>): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.run(userQueries.createUser, [user.firstName, user.lastName, user.email, user.photo, user.birthDate, user.gender], 
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            photo: user.photo,
                            birthDate: user.birthDate,
                            gender: user.gender,
                            hobbies: []
                        });
                    }
                });
        });
    }


    getAllUsers(): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.db.all(userQueries.getAllUsers, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as User[]);
                }
            });
        });
    }
}
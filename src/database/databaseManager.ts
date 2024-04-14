import sqlite3, { Database } from "sqlite3";
import * as queries from './userQueries';
import { User } from '../model/user'; 

export class UserSQLiteManager {
    private db: Database;

    constructor() {
        this.db = new sqlite3.Database('db/users.db');
    }

    createUser(user: Omit<User, 'id'>): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.run(queries.createUser, [user.firstName, user.lastName, user.email, user.password, user.photo, user.birthDate, user.gender], 
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
            this.db.all(queries.getAllUsers, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as User[]);
                }
            });
        });
    }

    getEmailRow(email: String): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.get(queries.getPassword, [email], (err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row as User);
                }
            });
        });
    }


}
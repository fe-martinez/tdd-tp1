import sqlite3, { Database } from "sqlite3";
import * as userQueries from './userQueries';
import * as dbCreationQueries from './dbCreationQueries'
import { User } from '../model/user';

const PAGE_SIZE = 20;

export class UserSQLiteManager {
    private db: Database;

    constructor() {
        const DATABASE_PATH = process.env.DB_PATH;

        if(!DATABASE_PATH) {
            throw(new Error('Database path not defined in env'));
        }

        this.db = new sqlite3.Database(DATABASE_PATH);
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

    insertHobby(userID: Number, hobby: string): Promise<void> {
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

    createUser(user: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
        return new Promise<Omit<User, 'password'>>((resolve, reject) => {
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
                            photo: user.photo,
                            birthDate: user.birthDate,
                            gender: user.gender,
                            hobbies: user.hobbies
                        });
                    }
                });
        });
    }

    async getUsers(firstName?: string, lastName?: string, hobby?: number, page: number = 1): Promise<Omit<User, 'password'>[]> {
        try {
            let query = userQueries.getAllUsers;
            let params = [];
    
            if (hobby) {
                query += userQueries.getHobbiesSubquery;
                params.push(hobby);
            }
    
            if (firstName || lastName) {
                query += ' WHERE';
                if (firstName) {
                    query += ' u.firstName LIKE ?';
                    params.push(`%${firstName}%`);
                }
                if (lastName) {
                    query += firstName ? ' AND' : '';
                    query += ' u.lastName LIKE ?';
                    params.push(`%${lastName}%`);
                }
            }
    
            query += ' ORDER BY u.id';
            query += ' LIMIT ? OFFSET ?';
            params.push(PAGE_SIZE, (page - 1) * PAGE_SIZE);
    
            const users: User[] = await new Promise<User[]>((resolve, reject) => {
                this.db.all(query, params, async (err, rows: User[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        try {
                            for (const user of rows) {
                                user.hobbies = await this.getUserHobbies(user.id);
                            }
                            resolve(rows);
                        } catch (error) {
                            reject(error);
                        }
                    }
                });
            });
            return users;
        } catch (error) {
            throw error;
        }
    }
    
    async getUserHobbies(userId: number): Promise<string[]> {
        try {
            const hobbyRows: { name: string }[] = await new Promise<{ name: string }[]>((resolve, reject) => {
                this.db.all(userQueries.getAllUserHobbies, [userId], (err, rows: { name: string }[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            const hobbies: string[] = hobbyRows.map(row => row.name);
            return hobbies;
        } catch (error) {
            throw error;
        }
    }
    
    async getUserById(userId: number): Promise<Omit<User, 'password'> | null> {
        try {
            const user: Omit<User, 'password'> | null = await new Promise<Omit<User, 'password'> | null>((resolve, reject) => {
                this.db.get(userQueries.getUserById, [userId], async (err, row: User | undefined) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (row) {
                            const user: Omit<User, 'password'> = {
                                id: row.id,
                                firstName: row.firstName,
                                lastName: row.lastName,
                                email: row.email,
                                    photo: row.photo,
                                birthDate: new Date(row.birthDate),
                                gender: row.gender,
                                hobbies: []
                            };
    
                            try {
                                user.hobbies = await this.getUserHobbies(userId);
                                resolve(user);
                            } catch (error) {
                                reject(error);
                            }
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
        

    private async checkIfSameUser(followerId: number, followedId: number): Promise<void> {
        if (followerId === followedId) {
            throw new Error('No puedes seguirte a ti mismo');
        }
        if (followedId === 0) {
            throw new Error('No se puede seguir al usuario con ID 0');
        }
    }

    async getFollowingByUserId(userId: number): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.db.all(userQueries.getFollowingByUserIdQuery, [userId], (err, rows: User[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    private async checkIfAlreadyFollowing(followerId: number, followedId: number): Promise<void> {
        const alreadyFollowing = await new Promise<boolean>((resolve, reject) => {
            this.db.get(userQueries.checkFollowQuery, [followerId, followedId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(!!row);
                }
            });
        });

        if (alreadyFollowing) {
            throw new Error('El seguidor ya está siguiendo al usuario');
        }
    }

    async followUser(followerId: number, followedId: number): Promise<User> {
        await this.checkIfSameUser(followerId, followedId);
        await this.checkIfAlreadyFollowing(followerId, followedId);
    
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
                    reject(new Error('Usuario no encontrado'));
                } else {
                    resolve(row as User);
                }
            });
        });
    }
        
    async getFollowersByUserId(userId: number): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.db.all(userQueries.getFollowersByUserIdQuery, [userId], (err, rows: User[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    async unfollowUser(followerId: number, userIdToUnfollow: number): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.db.run(userQueries.deleteFollowQuery, [followerId, userIdToUnfollow], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
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

    updatePhoto(userId: number, photo: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run(userQueries.updatePhoto, [photo, userId], err => err ? reject(err) : resolve());
        });
    }

    async changeEmailbyId(id: number, email: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(userQueries.updateEmailById, [email, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    if (this.changes === 0) {
                        const noChangesError = new Error("No se realizó ningún cambio en la contraseña");
                        reject(noChangesError);
                    } else {
                        resolve();
                    }
                }
            });
        });
    }

    async changeFirstNamebyId(id: number, firstName : string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(userQueries.updateFirstNameById, [firstName, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    if (this.changes === 0) {
                        const noChangesError = new Error("No se realizó ningún cambio en la contraseña");
                        reject(noChangesError);
                    } else {
                        resolve();
                    }
                }
            });
        });
    } 

    async changeGenderbyId(id: number, gender : string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(userQueries.updateGenderById, [gender, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    if (this.changes === 0) {
                        const noChangesError = new Error("No se realizó ningún cambio en la contraseña");
                        reject(noChangesError);
                    } else {
                        resolve();
                    }
                }
            });
        });
    }
 
    async changePasswordbyId(id: number, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
        this.db.run(userQueries.updatePasswordById, [newPassword, id], function(err) {
            if (err) {
                reject(err);
            } else {
                if (this.changes === 0) {
                    const noChangesError = new Error("No se realizó ningún cambio en la contraseña");
                    reject(noChangesError);
                } else {
                    resolve();
                }
            }
        });
    });
    }

    async getAllHobbies(): Promise<{ id: number; name: string }[]> {
        return new Promise<{ id: number; name: string }[]>((resolve, reject) => {
            this.db.all(userQueries.getAllHobbiesQuery, (err, rows: { id: number; name: string }[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

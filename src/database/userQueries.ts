export const createUser = 'INSERT INTO users (firstName, lastName, email, password, photo, birthDate, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';

export const insertHobby = 'INSERT into user_hobbies (user_id, hobby_id) VALUES (?, ?)';

export const getPassword = 'SELECT password FROM users WHERE email = ?';

export const getUserById = `SELECT * FROM users WHERE id = ?`

export const getUserByEmail = `SELECT * FROM users WHERE email = ?`;

export const insertFollowQuery = `INSERT INTO user_follows (follower_id, followed_id) VALUES (?, ?)`;

export const getAllUsersIDs = 'SELECT id FROM users WHERE 1=1';
export const filterFirstName = ' AND firstName LIKE ?';
export const filterLastName = ' AND lastName LIKE ?';
export const getUsersIDbyHobbyID = 'SELECT user_id FROM user_hobbies WHERE hobby_id = ?'
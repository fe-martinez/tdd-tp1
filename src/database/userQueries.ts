export const getAllUsers = 'SELECT * FROM users';

export const createUser = 'INSERT INTO users (firstName, lastName, email, photo, birthDate, gender) VALUES (?, ?, ?, ?, ?, ?)';

export const getPassword = 'SELECT password FROM users WHERE email = ?';
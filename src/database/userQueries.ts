export const getAllUsers = 'SELECT * FROM users';

export const createUser = 'INSERT INTO users (firstName, lastName, email, photo, birthDate, gender) VALUES (?, ?, ?, ?, ?, ?)';
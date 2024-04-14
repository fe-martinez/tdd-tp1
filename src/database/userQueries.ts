export const getAllUsers = 'SELECT * FROM users';

export const createUser = 'INSERT INTO users (firstName, lastName, email, photo, birthDate, gender) VALUES (?, ?, ?, ?, ?, ?)';

export const createHobbiesTableQuery = `
    CREATE TABLE IF NOT EXISTS hobbies (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    )
`;

export const createUserHobbiesTableQuery = `
    CREATE TABLE IF NOT EXISTS user_hobbies (
        user_id INTEGER,
        hobby_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (hobby_id) REFERENCES hobbies(id),
        PRIMARY KEY (user_id, hobby_id)
    )
`;

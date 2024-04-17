export const getAllUsers = 'SELECT * FROM users';

export const createUser = 'INSERT INTO users (firstName, lastName, email, password, photo, birthDate, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';

export const getPassword = 'SELECT password FROM users WHERE email = ?';

export const getUserById = `SELECT * FROM users WHERE id = ?`

export const getUserByEmail = `SELECT * FROM users WHERE email = ?`;

export const insertFollowQuery = `INSERT INTO user_follows (follower_id, followed_id) VALUES (?, ?)`;

export const getFollowersByUserIdQuery = `
    SELECT u.*
    FROM users u
    INNER JOIN user_follows uf ON u.id = uf.follower_id
    WHERE uf.followed_id = ?;
`;

export const deleteFollowQuery = `
    DELETE FROM user_follows
    WHERE follower_id = ? AND followed_id = ?;
`;

export const checkFollowQuery = `
    SELECT * FROM user_follows
    WHERE follower_id = ? AND followed_id = ?;
`;
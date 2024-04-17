export const createUser = 'INSERT INTO users (firstName, lastName, email, password, photo, birthDate, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';

export const insertHobby = 'INSERT into user_hobbies (user_id, hobby_id) VALUES (?, ?)';

export const getPassword = 'SELECT password FROM users WHERE email = ?';

export const getUserById = `SELECT * FROM users WHERE id = ?`

export const getUserByEmail = `SELECT * FROM users WHERE email = ?`;

export const insertFollowQuery = `INSERT INTO user_follows (follower_id, followed_id) VALUES (?, ?)`;

export const updatePhoto = `UPDATE users SET photo = ? WHERE id = ?`;

export const getAllUsers = 'SELECT u.* FROM users u';

export const getHobbiesSubquery = `
INNER JOIN (
  SELECT user_id
  FROM user_hobbies
  WHERE hobby_id = ?
) uh ON u.id = uh.user_id
`;

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

export const getFollowingByUserIdQuery = `
    SELECT u.id, u.firstName, u.lastName, u.email, u.password, u.photo, u.birthDate, u.gender
    FROM users u
    INNER JOIN user_follows uf ON u.id = uf.followed_id
    WHERE uf.follower_id = ?;
`;
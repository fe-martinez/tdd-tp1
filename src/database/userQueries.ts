export const createUser = 'INSERT INTO users (firstName, lastName, email, password, photo, birthDate, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';

export const insertHobby = 'INSERT into user_hobbies (user_id, hobby_id) VALUES (?, ?)';

export const getPassword = 'SELECT password FROM users WHERE email = ?';

export const getUserById = `SELECT * FROM users WHERE id = ?`

export const getUserByEmail = `SELECT * FROM users WHERE email = ?`;

export const insertFollowQuery = `INSERT INTO user_follows (follower_id, followed_id) VALUES (?, ?)`;

export const getAllUsers = 'SELECT u.* FROM users u';

export const getHobbiesSubquery = `
INNER JOIN (
  SELECT user_id
  FROM user_hobbies
  WHERE hobby_id = ?
) uh ON u.id = uh.user_id
`;
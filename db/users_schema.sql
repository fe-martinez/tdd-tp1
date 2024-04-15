CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  firstName TEXT,
  lastName TEXT,
  email TEXT UNIQUE,
  password TEXT,
  photo TEXT,
  birthDate DATE,
  gender TEXT
);

CREATE TABLE IF NOT EXISTS user_hobbies (
        user_id INTEGER,
        hobby_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (hobby_id) REFERENCES hobbies(id),
        PRIMARY KEY (user_id, hobby_id)
);

CREATE TABLE IF NOT EXISTS user_follows (
    id INTEGER PRIMARY KEY,
    follower_id INTEGER,
    followed_id INTEGER,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followed_id) REFERENCES users(id)
);



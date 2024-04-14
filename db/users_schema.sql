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

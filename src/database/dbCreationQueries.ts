export const createUserTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    email TEXT UNIQUE,
    password TEXT,
    photo TEXT,
    birthDate DATE,
    gender TEXT
  )`;

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

export const createUserFollowsTableQuery = `
CREATE TABLE IF NOT EXISTS user_follows (
    id INTEGER PRIMARY KEY,
    follower_id INTEGER,
    followed_id INTEGER,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followed_id) REFERENCES users(id)
)
`;

export const insertHobbiesQuery = `INSERT OR IGNORE INTO hobbies (name) VALUES (?)`;

export const availableHobbies = [
    "Hiking",
    "Reading",
    "Cooking",
    "Running",
    "Painting",
    "Photography",
    "Drawing",
    "Gardening",
    "Writing",
    "Playing an Instrument",
    "Sculpting",
    "Dancing",
    "Yoga",
    "Meditation",
    "Swimming",
    "Cycling",
    "Fishing",
    "Knitting",
    "Woodworking",
    "Singing",
    "Calligraphy",
    "Pottery",
    "Birdwatching",
    "Chess",
    "Baking",
    "Golfing",
    "Volunteering",
    "Traveling",
    "Camping",
    "Surfing",
    "Kayaking",
    "Rock Climbing",
    "Scuba Diving",
    "Skydiving",
    "Paintball",
    "Astrophotography",
    "Stargazing",
    "Archery",
    "Billiards",
    "Candle Making"
];
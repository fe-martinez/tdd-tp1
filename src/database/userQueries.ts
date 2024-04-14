export const getAllUsers = 'SELECT * FROM users';

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
export const createUser = 'INSERT INTO users (firstName, lastName, email, password, photo, birthDate, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';

export const getPassword = 'SELECT password FROM users WHERE email = ?';

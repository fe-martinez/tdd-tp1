class UserNotExistsError extends Error {
    constructor() {
        super('User not exists');
        this.name = 'UserNotExistsError';
    }
}

class UserIncorrectPasswordError extends Error {
    constructor() {
        super('User incorrect password');
        this.name = 'UserIncorrectPasswordError';
    }
}

export { UserNotExistsError, UserIncorrectPasswordError }
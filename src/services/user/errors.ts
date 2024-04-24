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

class AlreadyFollowingError extends Error {
    constructor() {
        super('Already following user');
        this.name = 'AlreadyFollowingError';
    }
}

export { UserNotExistsError, UserIncorrectPasswordError, AlreadyFollowingError }
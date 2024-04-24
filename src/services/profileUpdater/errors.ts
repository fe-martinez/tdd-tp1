class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }
}

class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InternalServerError';
    }
}

export { BadRequestError, InternalServerError }
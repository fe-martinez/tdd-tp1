import { userValidSchema } from './userValidSchema';

describe('userValidSchema', () => {
    it('should validate a valid user object', () => {
        const validUser = {
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanperez@example.com',
            password: 'Password',
            photo: 'example.com/photo.jpg',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            hobbies: [1, 2, 3],
        };

        const { error } = userValidSchema.validate(validUser);

        expect(error).toBeUndefined();
    });

    it('should return an error for missing required fields', () => {
        const invalidUser = {
            firstName: 'Juan',
            email: 'juan@example.com',
            password: 'Password',
            photo: 'example.com/photo.jpg',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            hobbies: [1, 2, 3],
        };

        const { error } = userValidSchema.validate(invalidUser);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"lastName" is required');
    });

    it('should return an error for invalid email format', () => {
        const invalidUser = {
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanperez@example',
            password: 'Password',
            photo: 'https://example.com/photo.jpg',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            hobbies: [1, 2, 3],
        };

        const { error } = userValidSchema.validate(invalidUser);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"email" must be a valid email');
    });


    it('should return an error for invalid password format', () => {
        const invalidUser = {
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanperez@example.com',
            password: 'password',
            photo: 'example.com/photo.jpg',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            hobbies: [1, 2, 3],
        };

        const { error } = userValidSchema.validate(invalidUser);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"password"');
    });


    it('should return an error for last name length less than 2', () => {
        const invalidUser = {
            firstName: 'Juan',
            lastName: 'P',
            email: 'juanperez@example.com',
            password: 'Password',
            photo: 'example.com/photo.jpg',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            hobbies: [1, 2, 3],
        };

        const { error } = userValidSchema.validate(invalidUser);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"lastName" length must be at least 2 characters long');
    });

    it('should return an error for a future birth date', () => {
        const invalidUser = {
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juanperez@example.com',
            password: 'Password',
            photo: 'example.com/photo.jpg',
            birthDate: new Date('2050-01-01'),
            gender: 'male',
            hobbies: [1, 2, 3],
        };

        const { error } = userValidSchema.validate(invalidUser);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"birthDate" must be less than or equal to "now"');
    });

});
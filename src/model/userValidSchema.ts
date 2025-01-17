import joi from 'joi';
import { Gender } from './gender';

const MIN_PASSWORD_LENGTH = 8;
const MIN_LAST_NAME_LENGTH = 2;
const MAX_FIRST_NAME_LENGTH = 64;
const MAX_LAST_NAME_LENGTH = 64;
const UPPERCASEREGEX = /[A-Z]/;

const firstNameValidSchema = joi.string().max(MAX_FIRST_NAME_LENGTH).required();

const genderValidSchema = joi.string().valid(...Object.values(Gender)).required()

const emailValidSchema = joi.string().email().required();

const passwordValidSchema = joi.string().min(MIN_PASSWORD_LENGTH).regex(UPPERCASEREGEX).required()

const userValidSchema = joi.object({
    firstName: firstNameValidSchema,
    lastName: joi.string().min(MIN_LAST_NAME_LENGTH).max(MAX_LAST_NAME_LENGTH).required(),
    email: emailValidSchema,
    password: passwordValidSchema,
    photo: joi.string(),
    birthDate: joi.date().max('now').required(),
    gender: genderValidSchema,
    hobbies: joi.array().items(joi.number().integer().min(1).max(40)).required()
});

export { userValidSchema, firstNameValidSchema, genderValidSchema, emailValidSchema, passwordValidSchema};
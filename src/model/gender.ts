export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    NON_BINARY = 'non-binary',
    AGENDER = 'agender',
    GENDERFLUID = 'genderfluid',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer-not-to-say'
}

export namespace Gender {
    export function isValid(gender: string): boolean {
        return Object.values(Gender).includes(gender as Gender);
    }
}
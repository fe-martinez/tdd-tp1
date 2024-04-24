export enum updateableUserProperties {
    email = "email",
    password = "password",
    gender = "gender",
    firstName = "firstName"
}

export namespace updateableUserProperties {
    export function isValid(property: string): boolean {
        return Object.values(updateableUserProperties).includes(property as updateableUserProperties);
    }

    export function areOptionsValid(options: any): boolean {
        const enumKeys = Object.keys(updateableUserProperties);
    
        for (const key in options) {
            if (!enumKeys.includes(key)) {
                return false;
            }
        }
    
        return true;
    };
    
}
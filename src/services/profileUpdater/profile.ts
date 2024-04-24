import Joi from "joi";
import { updateableUserProperties } from "../../model/updateableUserProperties";
import { firstNameValidSchema, emailValidSchema, genderValidSchema, passwordValidSchema } from '../../model/userValidSchema';

const validateEmail = async (id: number, email: string): Promise<boolean> => {
    const { error } = await emailValidSchema.validate(email);
    return !error;
  };
  const validateFirstName = async (fid: number, firstName: string): Promise<boolean> => {
    const { error } = await firstNameValidSchema.validate(firstName);
    return !error;
  };
  
  const validateGender = async (id: number, gender: string): Promise<boolean> => {
    const { error } = await genderValidSchema.validate(gender);
    return !error;
  };
  
  const validatePassword = async (id: number, password: string): Promise<boolean> => {
    const { error } = await passwordValidSchema.validate(password);
    return !error;
  };

const validationHandlers: { [key: string]: (id: number, value: string) => Promise<boolean> } = {
    [updateableUserProperties.email]: validateEmail,
    [updateableUserProperties.password]: validatePassword,
    [updateableUserProperties.gender]: validateGender,
    [updateableUserProperties.firstName]: validateFirstName,
  };


export class ProfileUpdater {

    constructor() {
    
    }

    async update(reqBody: Object, id: number) {
        try {
            const updates = await this.getUpdates(reqBody);
            const isValidUpdates = await this.validateUpdates(id, updates);
            console.log(updates);
            console.log(isValidUpdates);
        }
        catch (error) {
            console.log(error);
        }
    }

    async validateUpdates(id: number, updates: Map<string,string>) {
        for (const [key, value] of updates.entries()) {
            const handler = validationHandlers[key];
            if (handler) {
              const isValid = await handler(id, value);
              if (!isValid) {
                return false;
              }
            }
          }
        return true;
    }

    async getUpdates(reqBody: Object) {
        var updates : Map<string,string> = new Map();
        var keys = Object.keys(reqBody);
        var values = Object.values(reqBody);
        for (var i = 0; i < keys.length; i++) {
            if (updateableUserProperties.isValid(keys[i])) {
                updates.set(keys[i], values[i] as string);
            }
        }
        return updates
    }
}
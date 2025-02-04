import bcrypt from 'bcryptjs'
import { promises } from 'dns';

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {

    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);

    throw new Error("error hashing password");
};

export const verifyPassword =  async (inputPassword : string, hashedPassword : string)  : Promise<boolean> => {
    return await bcrypt.compare(inputPassword, hashedPassword);
    
    throw new Error("error verifying password");
}
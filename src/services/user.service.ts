import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/password.util";
import { createtoken } from "../utils/jwt.util";

const prisma = new PrismaClient;

export const registerUser = async (email : string, password : string) => {

    const existingUser = await prisma.user.findUnique({
        where :{email},
    });

    if(existingUser) {
        throw new Error("user already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data : {
            email,
            password : hashedPassword,
        },
    });

    return user;
}

export const loginUser = async (email : string , password : string) => {

    const user = await prisma.user.findUnique({
        where : {
            email : email,
        },
    });

    if(!user) {
        throw new Error("Email is not registered.");
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    // console.log(isPasswordValid);

    if(!isPasswordValid) {
        throw new Error("Invalid Password");
    }
    
    const token = createtoken({id : user.id, email : user.email});

    return token;
}


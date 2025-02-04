import { z } from 'zod'

const userSchema = z.object({
    email : z.string().email({message : "invalid email format"}),
    password : z.string().min(6,{message : "password must have atleast 6 characters"}),
}); 

export const validateUserData = (data : any) => {
    return userSchema.safeParse(data);
}


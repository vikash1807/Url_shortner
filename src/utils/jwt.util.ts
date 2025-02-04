import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomPayload } from '../types/user.types';

const jwtsecret = process.env.JWT_SECRET!;

if(!jwtsecret) {
    throw new Error("JWT_SECRET environment variable is not set")
}


export function createtoken(payload : CustomPayload) : string {
    const token = jwt.sign(payload, jwtsecret, {expiresIn : "10d"});
    return token;
} 


export function verifytoken(token : string) : CustomPayload {

    const decoded = jwt.verify(token, jwtsecret) as CustomPayload;
    if (
        typeof decoded === "object" && 
        decoded !== null &&
        "id" in decoded &&
        "email" in decoded
    ) {
        return decoded;
    }
    throw new Error("Invalid token provided");
}


export function decodetoken(token : string) : CustomPayload {

    const decoded = jwt.decode(token) as CustomPayload;
    if (
        typeof decoded === "object" &&
        decoded !== null &&
        "id" in decoded &&
        "email" in decoded
    ) {
        return decoded;
    }
    throw new Error("Invalid token");
}
 
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomPayload {
    id : number;
    email : string; 
}

export interface AuthenticatedRequest extends Request {
    user? : CustomPayload;
}
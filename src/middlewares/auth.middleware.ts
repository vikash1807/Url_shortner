import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifytoken } from "../utils/jwt.util";
import { AuthenticatedRequest, CustomPayload } from "../types/user.types";

const JWT_SECRET = process.env.JWT_SECRET || ""

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            throw new Error("Access denied, no token provided");
        }
        const decoded = verifytoken(token);
        req.user = decoded; 
        next();

    } catch (error) {

        res.status(401).json({ error: error instanceof Error ? error.message : 'Unauthorized : invalid token' });
    }
};

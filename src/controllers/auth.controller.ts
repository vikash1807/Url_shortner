import { Request, Response } from "express";
import { validateUserData } from "../utils/validate.util";
import { loginUser, registerUser } from "../services/user.service";


export const signup = async (req : Request, res : Response) => {

    try {
        const parsedData = validateUserData(req.body);
        if(!parsedData.success) {
            res.status(400).json({error : parsedData.error.format()});
            return;
        }
        const {email, password} = parsedData.data;

        const user = await registerUser(email, password);
        res.status(201).json({
            message : "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ 
            error: "User registration failed", 
            details: error instanceof Error ? error.message : error 
        });
    }
}

export const signin = async (req : Request, res : Response) => {
    try {
        const parsedData = validateUserData(req.body);
        if(!parsedData.success) {
            res.status(400).json({error : parsedData.error.format()});
            return;
        }
        const {email, password} = parsedData.data;

        const token = await loginUser(email, password);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 10 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({message : "user logged in", token});

    } catch (error) {
        res.status(401).json({ error: error instanceof Error ? error.message : 'Login failed' });
    }
}

export const logout = (req : Request, res : Response) => {

    if(!req.cookies.jwt) {
        res.status(200).json({message : "no actve session", redirect : '/signin'})
    }
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });
    res.status(200).json({message : "user logged out successfully", redirect : '/signin'});
}



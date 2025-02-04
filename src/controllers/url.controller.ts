import { Request, Response } from "express";
import { generateShortUrl } from "../services/url.service";

export const createUrl =  async (req : Request, res : Response) => {
    
    const { originalUrl } = req.body;
    try{
        const shortUrl = generateShortUrl(originalUrl);
        
    } catch(error) {
        
    }

    
}
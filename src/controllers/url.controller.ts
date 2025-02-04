import { Request, Response } from "express";
import { generateShortUrl } from "../services/url.service";
import { findUrl } from "../services/db.service";
import { AuthenticatedRequest } from "../types/user.types";

export const createShortUrl =  async (req : AuthenticatedRequest, res : Response) => {
    
    try{
        if(!req.user) {
            throw new Error("Access denied, user not logged in");
        }
        
        const { originalUrl } = req.body;
        const userId = req.user.id;
    
        const shortUrl = await generateShortUrl(originalUrl, userId);

        res.status(201).json({
            shortUrl: `http://localhost:3000/api/v1/url/${shortUrl}`
        })

    } catch(error) {

        res.status(404).json({ error: error instanceof Error ? error.message : 'Url creation failed' });

    }
}

export const redirectShortUrl =  async (req : AuthenticatedRequest, res : Response) => {
    const { shortCode } = req.params;

  try {
    const url = await findUrl(shortCode);

    if (!url) {
       res.status(404).json({ error: 'URL not found' });
       return;
    }

    res.redirect(url.originalUrl);

  } catch (error) {
    res.status(404).json({ error: error instanceof Error ? error.message : 'Error redirecting short URL' });
  }
}


import express from 'express';
import { createShortUrl, redirectShortUrl } from '../controllers/url.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();


router.post('/shorten', authenticateUser, createShortUrl); // Create short URL
router.get('/:shortCode', redirectShortUrl); // Redirect short URL

export default router;
import express from 'express';
import { logout, signin, signup } from '../controllers/auth.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../types/user.types';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);

router.get("/profile", authenticateUser, (req : AuthenticatedRequest, res : express.Response) => {
    res.json({ message: "User authenticated", user: req.user });
});


router.get('/', (req,res)=>{
    res.json('auth route has been hit');
})

export default router;

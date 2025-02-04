import express from 'express';
const router = express.Router();

import authRouter from './auth.routes'
router.use('/auth', authRouter);

router.use('/', (req,res)=>{
    res.json('index router has been hit.');
})  
export default router;
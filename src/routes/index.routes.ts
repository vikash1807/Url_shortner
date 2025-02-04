import express from 'express';
const router = express.Router();

import authRoutes from './auth.routes'
import urlRoutes from './url.routes'

router.use('/auth', authRoutes);
router.use('/url', urlRoutes);

router.use('/', (req,res)=>{
    res.json('index router has been hit.');
})  
export default router;
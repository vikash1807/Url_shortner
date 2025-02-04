import express, { Application } from 'express';
import cookieParser from "cookie-parser";
const app : Application = express();

app.use(express.json());
app.use(cookieParser());

import router from './routes/index.routes'
app.use('/api/v1', router);

export default app;
import express, { Express, Request, Response } from 'express';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+ '/.env' });
import os from 'os';
import AuthRouter from './routes/AuthRoutes'
import { nextErrorHandler } from './utils/middleware';

const app: Express = express();
const port = process.env.PORT;
app.get('/health', (req: Request, res: Response) => {
    res.send(`Server running at port ${port}`);
});
app.use(AuthRouter)
app.use(nextErrorHandler);
app.listen(port, () => {
    console.log(`Server is running at ${os.hostname()}:${port}`);
});
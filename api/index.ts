import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import os from 'os'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4001;

app.get('/health', (req: Request, res: Response) => {
    res.send(`Server running at port ${port}`);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${os.hostname()}:${port}`);
});
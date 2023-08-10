import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './api/db/connection'
import apiRouter from './api/routes'
import bodyParser = require('body-parser');
dotenv.config();
connectDB();

const app: Express = express();
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(express.json());
const port = process.env.PORT;
app.use(cors())
app.get('/health', (req: Request, res: Response) => {
    res.send('Server Up');
});

app.use(apiRouter)
app.use((error: any, req: any, res: any, next: any) => {
    if (error && error instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    } else {
        next();
    }
})
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
import express from 'express';
import { postRouter } from './modules/post/post.router';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';


const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))


// Auth middleware for all /api/auth/* routes
app.all("/api/auth/*splat", toNodeHandler(auth));


// 1. Post routes
app.use("/", postRouter)


export default app;

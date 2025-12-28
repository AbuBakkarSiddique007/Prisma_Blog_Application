import express from 'express';
import { postRouter } from './modules/post/post.router';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";


const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));


app.use(express.json());

app.use("/", postRouter)


export default app;

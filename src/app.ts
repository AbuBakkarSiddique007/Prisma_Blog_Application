import express from 'express';
import { postRouter } from './modules/post/post.router';

const app = express();

app.use(express.json());

app.use("/", postRouter)


export default app;

import { Router, type NextFunction, type Request, type Response } from "express";
import { postController } from "./post.controller";
import { UserRole } from "../../middlewares/auth";
import { auth } from "../../middlewares/auth";


const router = Router()

// Get all posts
router.get("/posts", postController.getAllPosts)

// Create a new post (Protected route)
router.post("/posts", auth(UserRole.ADMIN, UserRole.USER), postController.createPost)

// Get a single post by ID
router.get("/posts/:id", postController.getPostById)




export const postRouter = router;
import { Router, type NextFunction, type Request, type Response } from "express";
import { postController } from "./post.controller";
import { UserRole } from "../../middlewares/auth";
import { auth } from "../../middlewares/auth";


const router = Router()

// Get all posts
router.get("/", postController.getAllPosts)

// Get all own posts
router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER), postController.getMyOwnPosts)

// Create a new post (Protected route)
router.post("/", auth(UserRole.ADMIN, UserRole.USER), postController.createPost)

// Get Stats (place before "/:id" to avoid shadowing)***
router.get("/stats", auth(UserRole.ADMIN), postController.getStats)

// Get a single post by ID
router.get("/:id", postController.getPostById)

// Update Post 
router.patch("/:postId", auth(UserRole.USER, UserRole.ADMIN), postController.updatePost)

// Update Post 
router.delete("/:postId", auth(UserRole.USER, UserRole.ADMIN), postController.deletePost)

export const postRouter = router;
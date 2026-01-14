import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth, UserRole } from "../../middlewares/auth";

const router = Router()

router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment)
router.get("/:commentId", commentController.getCommentById)
router.get("/author/:authorId", commentController.getCommentsByAuthor)


export const commentRouter = router;
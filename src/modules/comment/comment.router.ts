import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth, UserRole } from "../../middlewares/auth";

const router = Router()

router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment)
router.get("/:commentId", commentController.getCommentById)
router.get("/author/:authorId", commentController.getCommentsByAuthor)
router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment)
router.patch("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentController.updateComment)



export const commentRouter = router;
import { Router, type NextFunction, type Request, type Response } from "express";
import { postController } from "./post.controller";
import { UserRole } from "../../middlewares/auth";
import { auth } from "../../middlewares/auth";



const router = Router()


router.get("/",

    async (req, res) => {
        res.status(200).send("Hello World from Post Router")
    }
)

router.get("/posts", postController.getAllPosts)

router.post("/posts",
    auth(UserRole.ADMIN, UserRole.USER),

    postController.createPost)


export const postRouter = router;
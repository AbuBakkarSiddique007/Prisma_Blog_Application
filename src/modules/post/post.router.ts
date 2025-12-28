import { Router } from "express";
import { postController } from "./post.controller";


const router = Router()


router.get("/", 
    async (req,res )=>{
        res.status(200).send("Hello World from Post Router")
    }
)

router.post("/posts", postController.createPost)


export const postRouter = router;
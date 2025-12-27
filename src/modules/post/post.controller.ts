import type { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {

    try {
        const result = await postService.cratePost(req.body)

        res.status(201).json({
            message: "Post created successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to create post",
            details : error
        })
    }
}

export const postController = {
    createPost
}
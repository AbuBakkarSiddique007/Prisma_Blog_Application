import type { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {

    try {
        console.log(req.user);

        const result = await postService.createPost(req.body, req.user!.id);

        res.status(201).json({
            message: "Post created successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to create post",
            details: error
        })
    }
}


const getAllPosts = async (req: Request, res: Response) => {

    try {

        const {search } = req.query
        console.log("Search Query : ", search);

        const result = await postService.getAllPosts({ search: search as string });
        res.status(200).json({
            message: "Posts fetched successfully",
            data: result
        })


    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch posts",
            details: error
        })
    }
}


export const postController = {
    createPost,
    getAllPosts
}
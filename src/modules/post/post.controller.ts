import type { Request, RequestHandler, Response } from "express";
import { postService } from "./post.service";
import type { PostStatus } from "../../../generated/prisma/enums";
import paginationAndSortingHelper from "../../helpers/sortingAndPaginationHelpers";

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

        const { search } = req.query;
        console.log("Search Query : ", search);

        const tags = (req.query.tags as string)?.split(",") || [];
        console.log("Tags Query : ", tags);

        const isFeatured = req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined;
        console.log("isFeatured Query : ", isFeatured);


        const status = req.query.status;
        console.log("Status Query : ", status);

        const authorId = req.query.authorId;
        console.log("AuthorId Query : ", authorId);

        // Pagination and Sorting
        const { page, limit, skip, sortBy, sortOrder } = paginationAndSortingHelper(req.query);


        const result = await postService.getAllPosts({
            search: search as string,
            tags,
            isFeatured: isFeatured as boolean,
            status: status as PostStatus,
            authorId: authorId as string,
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        });

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


const getPostById: RequestHandler = async (req, res) => {
    try {

        const { id } = req.params;
        console.log("ID : ", id);

        if (!id) {
            throw new Error("Post ID is required");
        }

        const result = await postService.getPostById(id);

        res.status(200).json({
            message: "Post fetched successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch post by id",
            details: error
        })
    }

}


const getMyOwnPosts: RequestHandler = async (req, res) => {
    try {
        const user = req.user
        console.log("User :", user);

        if (!user) {
            throw new Error("Your are unauthorized!")
        }

        console.log("User :", user);

        const result = await postService.getMyOwnPosts(user?.id as string)

        res.status(200).json({
            message: "Retrieve your own posts successfully",
            data: result
        })

    } catch (error: any) {
        res.status(500).json({
            message: "Failed to Retrieve your own posts",
            detail: error.message
        })
    }
}


export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    getMyOwnPosts
}
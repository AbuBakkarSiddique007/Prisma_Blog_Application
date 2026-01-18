import type { RequestHandler } from "express"
import { commentService } from "./comment.service"

const createComment: RequestHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        req.body.authorId = userId!;

        const result = await commentService.createComment(req.body)

        res.status(201).json({
            message: "Comment created successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to create comment",
            details: error
        })

    }
}

const getCommentById: RequestHandler = async (req, res) => {

    try {
        const { commentId } = req.params;

        const result = await commentService.getCommentById(commentId as string)
        res.status(200).json({
            message: "Comment fetched successfully",
            data: result
        })


    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch comment",
            details: error
        })
    }
}

const getCommentsByAuthor: RequestHandler = async (req, res) => {

    try {
        const { authorId } = req.params;

        const result = await commentService.getCommentsByAuthor(authorId as string)

        res.status(200).json({
            message: "Comment by AuthorId fetched successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch comment by AuthorId",
            details: error
        })
    }
}

const deleteComment: RequestHandler = async (req, res) => {

    try {
        const user = req.user
        const { commentId } = req.params

        const result = await commentService.deleteComment(commentId as string, user?.id as string)

        res.status(200).json({
            message: "Comment delete successfully",
            data: result
        })

    } catch (error:any) {

        res.status(500).json({
            message: "Failed to delete comment",
            detail: error.message
           
        })
    }
}

export const commentController = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment
};
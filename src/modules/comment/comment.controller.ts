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

export const commentController = {
    createComment
};
import type { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const createComment = async (payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?: string

}) => {

    await prisma.post.findFirstOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        await prisma.comment.findFirstOrThrow({
            where: {
                id: payload.parentId,
                postId: payload.postId
            }
        })
    }

    const result = await prisma.comment.create({
        data: payload
    })

    return result;
}


const getCommentById = async (commentId: string) => {
    console.log("Comment : ", commentId);

    const result = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })

    return result
}


const getCommentsByAuthor = async (authorId: string) => {
    console.log("Author Id: ", authorId);

    return await prisma.comment.findMany({
        where: {
            id: authorId
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })

}

const deleteComment = async (commentId: string, authorId: string) => {
    console.log("Comment Delete!", { commentId, authorId });

    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },

        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Comment Not Found!")
    }

    const result = await prisma.comment.delete({
        where: {
            id: commentId
        }
    })

    return result
}


const updateComment = async (commentId: string, data: { content?: string, status?: CommentStatus }, authorId: string) => {

    console.log({ commentId, data, authorId });

    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },

        select: {
            id: true
        }
    })

    const result = await prisma.comment.updateMany({
        where: {
            id: commentId,
            authorId
        },
        data: data
    })
}


export const commentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment
};
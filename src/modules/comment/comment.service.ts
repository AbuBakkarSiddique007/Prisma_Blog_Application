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

    if (!payload.parentId) {
        await prisma.comment.findFirstOrThrow({
            where: {
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


export const commentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor
};
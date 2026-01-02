import type { Post, PostStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const createPost = async (
    postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'authorId'> & { views?: number }, userId: string
) => {
    const result = await prisma.post.create({
        data: {
            ...postData,
            authorId: userId,
            views: postData.views ?? 0
        }
    });
    return result;
};


const getAllPosts = async (payload: {
    search?: string,
    tags?: string[],
    isFeatured?: boolean,
    status?: PostStatus,
    authorId?: string

}) => {

    console.log("For get all posts");



    const result = await prisma.post.findMany({
        where: {
            AND: [
                payload.search ? {
                    OR: [
                        {
                            title: {
                                contains: payload.search as string,
                                mode: 'insensitive'
                            }
                        },
                        {
                            content: {
                                contains: payload.search as string,
                                mode: 'insensitive'
                            }
                        },
                        {
                            tags: {
                                has: payload.search as string
                            }
                        }
                    ]
                } : {},

                payload.tags && payload.tags.length > 0 ? {
                    tags: {
                        hasEvery: payload.tags || []
                    }
                } : {},

                payload.isFeatured !== undefined ? {
                    isFeatured: payload.isFeatured
                } : {},

                payload.status ? {
                    status: payload.status
                } : {},

                payload.authorId ? {
                    authorId: payload.authorId
                } : {}
            ]
        }
    })
    return result
}



export const postService = {
    createPost,
    getAllPosts
}
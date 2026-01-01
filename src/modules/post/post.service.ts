import type { Post } from "../../../generated/prisma/client"
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


const getAllPosts = async (payload: { search?: string }) => {

    console.log("For get all posts");



    const result = await prisma.post.findMany({
        where: {
            title: {
                contains: payload.search as string,
                mode: 'insensitive'
            }
        }
    })
    return result
}



export const postService = {
    createPost,
    getAllPosts
}
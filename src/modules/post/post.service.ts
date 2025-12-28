import type { Post } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const createPost = async (
    postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'> & { views?: number }
) => {
    const result = await prisma.post.create({
        data: {
            ...postData,
            views: postData.views || 0
        }
    });
    return result;
};

export const postService = {
    createPost
}
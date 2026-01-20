import { CommentStatus, PostStatus, type Post } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const createPost = async (
    postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'authorId'> & { views?: number }, userId: string,
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
    authorId?: string,
    page: number,
    limit: number,
    skip: number,
    sortBy: string | undefined,
    sortOrder: 'asc' | 'desc'

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
                } : {},


            ]
        },
        orderBy: {
            [payload.sortBy as string]: payload.sortOrder
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })


    const total = result.length;



    return {
        data: result,
        pagination: {
            total,
            page: payload.page,
            limit: payload.limit,
            totalPages: Math.ceil(total / payload.limit)
        }

    }
}


const getPostById = async (id: string) => {
    console.log("Get Post By Id");

    const result = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: id
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })

        const postData = await tx.post.findUnique({
            where: {
                id: id
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },

                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: {
                                createdAt: 'asc'
                            },

                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: {
                                        createdAt: 'asc'
                                    },
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        })

        return postData;
    })

    return result;
}


const getMyOwnPosts = async (authorId: string) => {

    // Ensure the requesting user exists and is ACTIVE
    const userInfo = await prisma.user.findFirstOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        },
        select: {
            id: true
        }
    })

    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    /**
     * const total = await prisma.post.aggregate({
        _count : {
            id : true
        },
        where : {
            authorId
        }
    })

    return {
        result,
        total
    };
     */

    return result
}


/**
 * user : update only own post. Cannot update isFeatured option
 * admin : update all post . Can update isFeatured option
 */

const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    console.log("Update Post: ", {
        postId,
        data,
        authorId
    });

    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not owner/creator of the post!")
    }

    if (!isAdmin) {
        delete data.isFeatured
    }

    const result = await prisma.post.update({
        where: {
            id: postData.id
        },
        data
    })
    return result
}


/**
 * 1. user: user delete only own post.
 * 2. admin : delete all users post.
 */

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {

    const postData = await prisma.post.findFirstOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not owner/creator of the post!")
    }

    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    })

    return result
}


export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    getMyOwnPosts,
    updatePost,
    deletePost
}
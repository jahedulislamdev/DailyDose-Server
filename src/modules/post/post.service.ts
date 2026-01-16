import {
    CommentStatus,
    Post,
    PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enum/enum";

const createPost = async (
    data: Omit<Post, "id" | "createdAt" | "updatedAt">,
    userId: string,
) => {
    return await prisma.post.create({
        data: { ...data, authorId: userId },
    });
};

// get post with searching,sorting,filtering and pagination
const getPosts = async (
    searchedValue: string | undefined,
    filteredTags: string[],
    isFeatured: Boolean | undefined,
    status: PostStatus | undefined,
    authorId: string | undefined,
    skip: number,
    limit: number,
    page: number,
    sortBy: string | undefined,
    sortOrder: string | undefined,
) => {
    let andConditions: PostWhereInput[] = [];
    if (searchedValue) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchedValue,
                        mode: "insensitive",
                    },
                },
                {
                    content: {
                        contains: searchedValue,
                        mode: "insensitive",
                    },
                },
                {
                    tags: {
                        has: searchedValue,
                    },
                },
            ],
        });
    }
    if (filteredTags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: filteredTags,
            },
        });
    }
    // console.log(typeof isFeatured, isFeatured);

    if (typeof isFeatured === "boolean") {
        andConditions.push({
            isFeatured,
        });
    }
    if (status) {
        andConditions.push({
            status,
        });
    }
    if (authorId) {
        andConditions.push({
            authorId,
        });
    }

    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions,
        },
        include: {
            _count: {
                select: {
                    comments: true,
                },
            },
        },
        orderBy:
            sortBy && sortOrder
                ? {
                      [sortBy]: sortOrder,
                  }
                : {
                      createdAt: "asc",
                  },
    });
    const totalPost = await prisma.post.count({
        where: {
            AND: andConditions,
        },
    });

    return {
        allPost: result,
        pagination: {
            totalPost,
            page,
            limit,
            totalPage: Math.ceil(totalPost / limit),
        },
    };
};

const getPostbyId = async (postId: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
        });
        return await tx.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED,
                            },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED,
                                    },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });
    });
};

const getPostbyAuthorId = async (authorId: string) => {
    await prisma.user.findUniqueOrThrow({
        where: { id: authorId, status: "ACTIVE" },
    });
    const result = await prisma.post.findMany({
        where: { authorId },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: { comments: true },
            },
        },
    });
    const totalPost = await prisma.post.aggregate({
        _count: {
            id: true,
        },
        where: {
            authorId,
        },
    });
    return { totalPost, posts: result };
};

const updatePost = async (
    authorId: string,
    role: UserRole,
    postId: string,
    updatedData: Partial<Post>,
) => {
    const existValidPost = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        select: {
            id: true,
            authorId: true,
        },
    });
    if (role !== UserRole.ADMIN && existValidPost?.authorId !== authorId) {
        throw new Error("Unauthorized!");
    }
    if (role !== UserRole.ADMIN) {
        delete updatedData.isFeatured;
    }
    return await prisma.post.update({
        where: {
            id: postId,
        },
        data: updatedData,
    });
};

const deletePost = async (authorId: string, postId: string, role: UserRole) => {
    const existValidPost = await prisma.post.findUniqueOrThrow({
        where: { id: postId },
        select: {
            id: true,
            authorId: true,
        },
    });
    if (role !== UserRole.ADMIN && existValidPost?.authorId !== authorId) {
        throw new Error("Unauthorized!");
    }
    return await prisma.post.delete({
        where: {
            id: postId,
        },
    });
};

const getStats = async () => {
    return await prisma.$transaction(async (tx) => {
        const [
            posts,
            publishedPosts,
            archivedPosts,
            draftPosts,
            comments,
            approvedComments,
            rejectedComments,
            totalUser,
            admins,
            users,
            totalPostviewers,
        ] = await Promise.all([
            // post statistics
            await tx.post.count(),
            await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
            await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
            await tx.post.count({ where: { status: PostStatus.DRAFT } }),
            // comment statistics
            await tx.comment.count(),
            await tx.comment.count({
                where: { status: CommentStatus.APPROVED },
            }),
            await tx.comment.count({
                where: { status: CommentStatus.REJECTED },
            }),
            // user statistics
            await tx.user.count(),
            await tx.user.count({ where: { role: UserRole.ADMIN } }),
            await tx.user.count({ where: { role: UserRole.USER } }),
            // all post viewer count
            await tx.post.aggregate({
                _sum: { views: true },
            }),
        ]);
        return {
            posts,
            publishedPosts,
            archivedPosts,
            draftPosts,
            comments,
            approvedComments,
            rejectedComments,
            totalUser,
            admins,
            users,
            totalPostviewers: totalPostviewers._sum.views,
        };
    });
};
export const postService = {
    createPost,
    getPosts,
    getPostbyId,
    getPostbyAuthorId,
    updatePost,
    deletePost,
    getStats,
};

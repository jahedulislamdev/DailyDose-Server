import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
    data: Omit<Post, "id" | "createdAt" | "updatedAt">,
    userId: string,
) => {
    const result = await prisma.post.create({
        data: { ...data, authorId: userId },
    });
    return result;
};

// searching
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
        const result = await tx.post.findUnique({
            where: {
                id: postId,
            },
        });
        return result;
    });
};

export const postService = {
    createPost,
    getPosts,
    getPostbyId,
};

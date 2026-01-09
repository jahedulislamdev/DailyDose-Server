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
    });
    return result;
};

export const postService = {
    createPost,
    getPosts,
};

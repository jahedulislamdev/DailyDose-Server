import { Post } from "../../../generated/prisma/client";
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
    } else if (filteredTags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: filteredTags,
            },
        });
    }
    const result = await prisma.post.findMany({
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

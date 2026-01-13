import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
}) => {
    if (payload.postId) {
        await prisma.post.findUniqueOrThrow({
            where: {
                id: payload.postId,
            },
        });
    }
    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId,
            },
        });
    }
    return await prisma.comment.create({
        data: payload,
    });
};
const getCommentById = async (id: string) => {
    return prisma.comment.findUnique({
        where: {
            id,
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    _count: true,
                },
            },
        },
    });
};
const getCommentByAuthorId = async (authorId: string) => {
    return prisma.comment.findMany({
        where: {
            authorId,
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
};

export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
};

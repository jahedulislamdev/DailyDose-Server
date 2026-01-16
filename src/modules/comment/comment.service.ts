import { CommentStatus } from "../../../generated/prisma/enums";
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
const deleteComment = async (commentId: string, authorId: string) => {
    console.log({ commentId, authorId });

    const existComment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId,
        },
    });
    if (existComment.authorId !== authorId) {
        throw new Error("Unauthorized!");
    }
    return prisma.comment.delete({
        where: {
            id: commentId,
        },
    });
};
const updateCommentStatus = async (
    commentId: string,
    authorId: string,
    status: CommentStatus,
) => {
    // console.log({ commentId, authorId, status });

    const currentComment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId,
        },
    });
    console.log(currentComment);

    if (currentComment?.status === status) {
        throw new Error("Status Already up-to-date!");
    }
    return await prisma.comment.update({
        where: {
            id: commentId,
        },
        data: {
            status,
        },
    });
};
export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateCommentStatus,
};

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

export const commentService = {
    createComment,
};

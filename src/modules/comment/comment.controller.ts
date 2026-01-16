import { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.service";
import { CommentStatus } from "../../../generated/prisma/enums";

const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id;
        //  console.log(req.body);

        const result = await commentService.createComment(req.body);
        res.status(201).send(result);
    } catch (e) {
        next(e);
    }
};

const getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { commentId } = req.params;
        const result = await commentService.getCommentById(commentId as string);
        res.status(200).json({
            success: true,
            message: "comment featched successfully!",
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const getCommentByAuthorId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { authorId } = req.params;
    try {
        const result = await commentService.getCommentByAuthorId(
            authorId as string,
        );
        res.status(200).json({
            success: true,
            message: "Comment Fatched successfully!",
            data: result,
        });
    } catch (e) {
        next(e);
    }
};
const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentService.deleteComment(
            commentId as string,
            user?.id as string,
        );
        res.status(200).json({
            success: true,
            message: "comment delete successfully!",
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const updateCommentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await commentService.updateCommentStatus(
            req.params.commentId as string,
            req.user?.id as string,
            req.body.status as CommentStatus,
        );
        res.status(200).json({
            success: true,
            message: "comment status update successfully!",
            data: result,
        });
    } catch (e) {
        next(e);
    }
};
export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateCommentStatus,
};

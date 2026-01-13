import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { serverError } from "../../utils/server.error";

const createComment = async (req: Request, res: Response) => {
    const user = req.user;
    req.body.authorId = user?.id;
    //  console.log(req.body);

    const result = await commentService.createComment(req.body);
    res.status(201).send(result);
};

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await commentService.getCommentById(commentId as string);
        res.status(200).json({
            success: true,
            message: "comment featched successfully!",
            data: result,
        });
    } catch (e) {
        serverError(res, e);
    }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
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
        serverError(res, e);
    }
};
export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
};

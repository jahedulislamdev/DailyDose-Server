import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    const user = req.user;
    req.body.authorId = user?.id;
    //  console.log(req.body);

    const result = await commentService.createComment(req.body);
    res.status(201).send(result);
};
export const commentController = {
    createComment,
};

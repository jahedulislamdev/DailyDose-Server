import { Request, Response } from "express";
import { postService } from "./post.service";
import { serverError } from "../../utils/server.error";

const createPost = async (req: Request, res: Response) => {
    console.log(req.user);
    try {
        console.log(req.user);
        const result = await postService.createPost(req.body);
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: result,
        });
    } catch (err: any) {
        serverError(res, err);
    }
};

const getPosts = async (req: Request, res: Response) => {
    try {
        const results = await postService.getPosts();
        res.status(200).json({
            success: true,
            message: "Posts retrieved successfully",
            data: results,
        });
    } catch (err) {
        serverError(res, err);
    }
};

export const postController = {
    createPost,
    getPosts,
};

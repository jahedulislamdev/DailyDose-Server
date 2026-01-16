import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortHelper from "../../utils/paginationSortingHelper";
import { UserRole } from "../../types/enum/enum";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.user);

        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = await postService.createPost(req.body, req.user?.id);
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: result,
        });
    } catch (err: any) {
        next(err);
    }
};

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, tags, isFeatured, status, authorId } = req.query;

        // filter by multiple tags
        const filterdTags = tags
            ? (tags as string)
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [];
        // ["environment","election","education"] : [""]

        // search by title, content and tags
        const searchValue =
            typeof search === "string" && search.trim() !== ""
                ? search.trim()
                : undefined;
        //searchStr -> visa processing system : undefined

        //filter by featuredPosts. accept boolean values only
        const featuredPosts =
            isFeatured === "true"
                ? true
                : isFeatured === "false"
                  ? false
                  : undefined;

        // console.log({ featuredPosts });
        // filter by status only if valid status is provided
        const postStatus =
            status === "DRAFT" ||
            status === "PUBLISHED" ||
            status === "ARCHIVED"
                ? status
                : undefined;

        // pagination and sorting
        const { page, limit, sortBy, skip, sortOrder } = paginationSortHelper(
            req.query as any,
        );

        // call service method
        const result = await postService.getPosts(
            searchValue,
            filterdTags,
            featuredPosts,
            postStatus as PostStatus | undefined,
            authorId as string | undefined,
            skip,
            limit,
            page,
            sortBy as string | undefined,
            sortOrder as string | undefined,
        );
        // res.status(200).json(result);
        res.status(200).json({
            success: true,
            message: "post retrived successfully!",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getPostbyAuthorId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        console.log(req.user);

        const { authorId } = req.params;
        const result = await postService.getPostbyAuthorId(authorId as string);
        res.status(200).json({
            success: true,
            message: "Posts retrieved successfully!",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            throw new Error("Unauthorized");
        }
        const result = await postService.updatePost(
            req.user?.id as string,
            req.user?.role as UserRole,
            req.params.postId as string,
            req.body,
        );
        res.status(200).json({
            success: true,
            message: "Posts retrieved successfully!",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await postService.deletePost(
            req.user?.id as string,
            req.params.postId as string,
            req.user?.role as UserRole,
        );
        res.status(200).json({
            success: true,
            message: "Post deleted successfully!",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await postService.getStats();
        res.status(200).json({
            success: true,
            message: "state featched successfully!",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};
export const postController = {
    createPost,
    getPosts,
    getPostbyAuthorId,
    updatePost,
    deletePost,
    getStats,
};

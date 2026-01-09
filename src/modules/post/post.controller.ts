import { serverError } from "../../utils/server.error";
import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
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
        serverError(res, err);
    }
};

const searchPost = async (req: Request, res: Response) => {
    try {
        const { search, tags, isFeatured, status, authorId, page, limit } =
            req.query;

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

        // pagination values
        const postPage = Number(page ?? 1);
        const postLimit = Number(limit ?? 10);
        const skippedPosts = (postPage - 1) * postLimit;

        // call service method
        const result = await postService.getPosts(
            searchValue,
            filterdTags,
            featuredPosts,
            postStatus as PostStatus | undefined,
            authorId as string | undefined,
            skippedPosts,
            postLimit,
        );
        if (Array.isArray(result) && result.length === 0) {
            res.status(404).json({
                success: false,
                message: "No Post Found!",
                data: result,
            });
        } else if (Array.isArray(result)) {
            res.status(200).json({
                success: true,
                message: "post retrived successfully!",
                data: result,
            });
        }
    } catch (err) {
        serverError(res, err);
    }
};

export const postController = {
    createPost,
    searchPost,
};

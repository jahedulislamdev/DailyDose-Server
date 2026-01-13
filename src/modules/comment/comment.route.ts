import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();
router.post("/", commentController.createComment);
router.get("/:commentId", commentController.getCommentById);
router.get("/author/:authorId", commentController.getCommentByAuthorId);

export const commentRoute = router;

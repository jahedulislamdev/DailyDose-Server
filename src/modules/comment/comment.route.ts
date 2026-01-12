import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();

router.post("/", commentController.createComment);

export const commentRoute = router;

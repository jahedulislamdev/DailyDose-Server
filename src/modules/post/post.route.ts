import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();
router.post("/", postController.createPost);
router.get("/", postController.getPosts);
export const postRoute: Router = router;

import { Router } from "express";
import { postController } from "./post.controller";
import { UserRole } from "../../types/enum/enum";
import authChecker from "../../middleware/authChecker";

const router = Router();
router.post(
    "/",
    authChecker(UserRole.ADMIN, UserRole.USER),
    postController.createPost,
);
router.get("/", postController.getPosts);

router.get(
    "/author/:authorId",
    authChecker(UserRole.ADMIN, UserRole.USER),
    postController.getPostbyAuthorId,
);
router.get("/:postId", postController.getPostByPostId);
router.patch(
    "/:postId",
    authChecker(UserRole.ADMIN, UserRole.USER),
    postController.updatePost,
);
router.delete(
    "/:postId",
    authChecker(UserRole.ADMIN, UserRole.USER),
    postController.deletePost,
);
router.get("/stats", authChecker(UserRole.ADMIN), postController.getStats);
export const postRoute: Router = router;

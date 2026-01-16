import { Router } from "express";
import { commentController } from "./comment.controller";
import authChecker from "../../middleware/authChecker";
import { UserRole } from "../../types/enum/enum";

const router = Router();
router.post(
    "/",
    authChecker(UserRole.ADMIN, UserRole.USER),
    commentController.createComment,
);
router.get(
    "/:commentId",
    authChecker(UserRole.ADMIN),
    commentController.getCommentById,
);
router.get(
    "/author/:authorId",
    authChecker(UserRole.ADMIN),
    commentController.getCommentByAuthorId,
);
router.delete(
    "/:commentId",
    authChecker(UserRole.ADMIN, UserRole.USER),
    commentController.deleteComment,
);
router.patch(
    "/:commentId",
    authChecker(UserRole.ADMIN, UserRole.USER),
    commentController.updateCommentStatus,
);

export const commentRoute = router;

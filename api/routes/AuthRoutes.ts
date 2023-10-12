import Express from "express";
import { asyncHandler } from "../utils/middleware";
import * as AuthControllers from "../controllers/AuthController";
const router = Express.Router();

router.get(
  "/auth/githubAuthUrl",
  asyncHandler(AuthControllers.generateAuthUrl)
);
router.get(
  "/auth/githubCallback",
  asyncHandler(AuthControllers.handleGithubCallback)
);

export default router;

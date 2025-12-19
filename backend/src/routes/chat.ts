import { Router } from "express";
import { chatController, getOldConversation } from "../controllers/chatController"

const router = Router();

router.post("/chat/message", chatController);
router.get("/chat", getOldConversation);

export default router;
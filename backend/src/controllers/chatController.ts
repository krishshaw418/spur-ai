import type { Request, Response } from "express";
import { generateReply } from "../util/llmInterface";
import { fetchConveration } from "../util/fetchConversation";
import * as z from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "@google/genai";

const userInput = z.object({
    message: z.string().max(250),
    sessionId: z.optional(z.string().min(3))
})

export const chatController = async (req: Request, res: Response) => {
    const parsedInput = userInput.safeParse(req.body);
    console.log(req.body);
    if (!parsedInput.success) {
        return res.status(400).json({ message: "Invalid input!", error: JSON.parse(parsedInput.error.message)[0].message });
    }
    try {

        if (parsedInput.data.message.length === 0) {
            return res.status(400).json({ message: "Please enter your prompt!", error: "Empty message field!" });
        }

        if (parsedInput.data.sessionId) {
            console.log(parsedInput.data.sessionId);
            if (parsedInput.data.sessionId.length !== 0) {
                const llmResponse = await generateReply(parsedInput.data.message, parsedInput.data.sessionId);
                return res.status(200).json({ reply: llmResponse?.reply, timestamp: llmResponse?.timestamp, role: llmResponse?.role });
            }
            return res.status(400).json({ message: "Please enter your prompt!", error: "Empty sessionId field!" });
        }

        const newConversation = await prisma.conversation.create({});

        const llmResponse = await generateReply(parsedInput.data.message, newConversation.id);
        res.status(200).json({ reply: llmResponse?.reply, timestamp: llmResponse?.timestamp, role: llmResponse?.role, userId: `user-session:${llmResponse?.sessionId}` });
    } catch (error) {
        console.error(error);

        if (error instanceof ApiError) {
            if (error.status === 400) {
                return res.status(error.status).json({ message: "The request body is malformed or This free tier is not available in your country." });
            }
            if (error.status === 403) {
                return res.status(error.status).json({ message: "The server API key doesn't have the required permissions." });
            }
            if (error.status === 404) {
                return res.status(error.status).json({ message: "The requested resource wasn't found." });
            }
            if (error.status === 429) {
                return res.status(error.status).json({ message: "You've exceeded the rate limit." });
            }
            if (error.status === 500) {
                return res.status(error.status).json({ message: "An unexpected error occurred on LLM's side." });
            }
            if (error.status === 503) {
                return res.status(error.status).json({ message: "The service may be temporarily overloaded or down." });
            }
            if (error.status === 504) {
                return res.status(error.status).json({ message: "The service is unable to finish processing within the deadline." });
            }
        }

        return res.status(500).json({ message: "Something went wrong!" });
    }
}

const conversationId = z.object({
    conversationId: z.string()
})

export const getOldConversation = async (req: Request, res: Response) => {
    const parsedInput = conversationId.safeParse(req.query);

    if (!parsedInput.success) {
        return res.status(400).json({ message: "Invalid Input!", error: JSON.parse(parsedInput.error.message)[0].message });
    }

    try {
        const result = await fetchConveration(parsedInput.data.conversationId);
        if (!result.success) {
            return res.status(404).json({ success: result.success, message: result.message });
        }
        res.status(200).json({ success: result.success, chatHistory: result.messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}
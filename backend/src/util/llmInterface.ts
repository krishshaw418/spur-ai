import { type Content } from "@google/genai";
import { prisma } from "../lib/prisma";
import { createConversation } from "./conversation";


export const generateReply = async (userId: string, msg: string, sessionId: string) => {
    
    try {
        let result;
        
        const messages = await prisma.message.findMany({
            where: {
                conversationId: sessionId
            }
        });

        // If the conversation is new
        if (messages.length === 0) {
            result = await createConversation(userId, msg, sessionId, []);
        } else {
            // If its a continuation of an old conversation
            const oldConversation: Content[] = await prisma.message.findMany({
                where: {
                    conversationId: sessionId
                },
                select: {
                    parts: {
                        select: {
                            text: true
                        }
                    },
                role: true
                }
            });

            result = await createConversation(userId, msg, sessionId, oldConversation);
        }

        return result;
    } catch (error) {
        throw error;
    }
}

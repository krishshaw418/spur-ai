import { prisma } from "../lib/prisma";
import { getRedisClient } from "../lib/redis";

export const fetchConveration = async (conversationId: string) => {

    try {
        const client = await getRedisClient();

        const rawMessages = await client.lRange(
            `user-session:${conversationId}`,
            0,
            -1
        );
        
        const messages = rawMessages.map((msg) => {
            return JSON.parse(msg);
        })

        if (messages.length === 0) {
            const pastMessages = await prisma.message.findMany({
            where: {
                conversationId
            },
                select: {
                    parts: {
                        select: {
                            text: true
                        },
                        orderBy: { order: 'asc' }
                    },
                role: true,
                    timeStamp: true
                }
            });

            if (pastMessages.length === 0) {
                return {
                    success: false,
                    message: "There is no previous chat history for this conversation"
                }
            }

            const messages = pastMessages.map((msg) => {
                const message = msg.parts.map((prt, i) => {
                    return prt.text
                }).join("");

                return { message: message, role: msg.role, timestamp: msg.timeStamp }
            })

            return {
                success: true,
                messages: messages
            };
        }
        
        console.log("Returned from cache!");

        return {
            success: true,
            messages: messages
        }

    } catch (error) {
        throw error;
    }
}
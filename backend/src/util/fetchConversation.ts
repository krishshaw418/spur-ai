import { prisma } from "../lib/prisma";

export const fetchConveration = async (conversationId: string) => {

    try {
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

    } catch (error) {
        throw error;
    }
}
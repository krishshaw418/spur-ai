import { GoogleGenAI, type Content } from "@google/genai";
import { prisma } from "../lib/prisma";

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
    console.error("apiKey not loaded!");
}

export const generateReply = async (msg: string, sessionId: string) => {
    const gemini = new GoogleGenAI({
        apiKey
    });
    
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: sessionId
            }
        });

        // If the conversation is new
        if (messages.length === 0) {
            const chat = gemini.chats.create({
                model: "gemini-2.5-flash",
                config: {
                    systemInstruction: "You are a helpful support agent for a small e-commerce store. Answer clearly and concisely.",
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                }
            });

            const response = await chat.sendMessage({
                message: msg
            });

            if (!response.text) {
                return {
                    reply: "Error",
                    sessionId: sessionId
                }
            }

            // Chunk down user's message into parts
            const y = 10;
            const userMsgChunks = Array.from({ length: Math.ceil(msg.length / y) }, (v, i) =>
                msg.slice(i * y, i * y + y)
            ) as string[];

            // new record of user's message
            const newUserMessage = await prisma.message.create({
                data: {
                    conversationId: sessionId,
                    role: "user"
                }
            })

            for (let i = 0; i < userMsgChunks.length; i++) {
                await prisma.part.create({
                    data: {
                        messageId: newUserMessage.id,
                        text: userMsgChunks[i],
                        order: i
                    }
                })
            }

            const x = 10;
            // breakdown model's response into chunks
            const modelRespChunks = Array.from({ length: Math.ceil(response?.text.length / x) }, (v, i) =>
                (response.text)?.slice(i * x, i * x + x)
            ) as string[];

            // new record of model response
            const modelReply = await prisma.message.create({
                data: {
                    conversationId: sessionId,
                    role: "model"
                }
            });

            for (let i = 0; i < modelRespChunks.length; i++) {
                await prisma.part.create({
                    data: {
                        messageId: modelReply.id,
                        text: modelRespChunks[i],
                        order: i
                    }
                })
            }
            return {
                reply: response.text,
                sessionId
            }
        }

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

        const chat = gemini.chats.create({
            model: "gemini-2.5-flash",
            history: oldConversation,
            config: {
                systemInstruction: "You are a helpful support agent for a small e-commerce store. Answer clearly and concisely.",
                thinkingConfig: {
                    thinkingBudget: 0
                }
            }
        });

        const response = await chat.sendMessage({
            message: msg
        });

        if (!response.text) {
            return {
                reply: "Error",
                sessionId
            }
        }

        const l = 10;
        const userMsgChunks = Array.from({ length: Math.ceil(msg.length / l) }, (v, i) =>
            msg.slice(i * l, i * l + l)
        ) as string[];

        // new record of user message
        const newUserMessage = await prisma.message.create({
            data: {
                conversationId: sessionId,
                role: "user"
            }
        });

        for (let i = 0; i < userMsgChunks.length; i++) {
            await prisma.part.create({
                data: {
                    messageId: newUserMessage.id,
                    text: userMsgChunks[i],
                    order: i
                }
            })

            const m = 10;
            const modelRespChunks = Array.from({ length: Math.ceil(response?.text.length / m) }, (v, i) =>
                (response.text)?.slice(i * m, i * m + m)
            ) as string[];

            // new record of model response
            const modelReply = await prisma.message.create({
                data: {
                    conversationId: sessionId,
                    role: "model"
                }
            });

            for (let i = 0; i < modelRespChunks.length; i++) {
                await prisma.part.create({
                    data: {
                        messageId: modelReply.id,
                        text: modelRespChunks[i],
                        order: i
                    }
                })
            }

            return {
                reply: response.text,
                sessionId
            }
        }
    } catch (error) {
        throw error;
    }
}

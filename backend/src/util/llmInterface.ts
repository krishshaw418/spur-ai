import { GoogleGenAI, type Content } from "@google/genai";
import { prisma } from "../lib/prisma";
import faqs from '../faqs.json';
import removeMd from "remove-markdown";
import { getRedisClient } from "../lib/redis";

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
    console.error("apiKey not loaded!");
}

export const generateReply = async (msg: string, sessionId: string) => {
    const gemini = new GoogleGenAI({
        apiKey
    });
    
    try {

        const client = await getRedisClient();

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
                    systemInstruction: `You are a customer support agent for SpurStore. Here is our store's policy information:${faqs} in json format. Use this information to answer customer questions accurately. Always be helpful, friendly, and refer to these exact policies when answering questions about shipping, returns, support hours, etc.`,
                    thinkingConfig: {
                        thinkingBudget: 0
                    },
                }
            });

            const response = await chat.sendMessage({
                message: msg
            });

            if (!response.text) {
                return {
                    reply: "Error",
                    timestamp: new Date(),
                    role: "model",
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

            // caching in redis
            await client.rPush(`user-session:${sessionId}`, JSON.stringify({
                message: msg,
                role: newUserMessage.role,
                timestamp: newUserMessage.timeStamp
            }));

            console.log("User msg cached in redis!");

            const plainText = removeMd(response.text);

            const x = 10;
            // breakdown model's response into chunks
            const modelRespChunks = Array.from({ length: Math.ceil(plainText.length / x) }, (v, i) =>
                (plainText)?.slice(i * x, i * x + x)
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

            // caching in redis
            await client.rPush(`user-session:${sessionId}`, JSON.stringify({
                message: plainText,
                role: modelReply.role,
                timestamp: modelReply.timeStamp
            }));

            console.log("Model response cached in redis!");

            const result = {
                reply: plainText,
                timestamp: modelReply.timeStamp,
                role: "model",
                sessionId
            };

            return result;
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
                systemInstruction:`You are a customer support agent for SpurStore. Here is our store's policy information:${faqs} Use this information to answer customer questions accurately. Always be helpful, friendly, and refer to these exact policies when answering questions about shipping, returns, support hours, etc.`,
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
                sessionId,
                timestamp: new Date(),
                role: "model"
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
        }

        await client.rPush(`user-session:${sessionId}`, JSON.stringify({
            message: msg,
            role: newUserMessage.role,
            timestamp: newUserMessage.timeStamp
        }));

        await client.expire(`user-session:${sessionId}`, 3600);

        console.log("User msg cached in redis!");

        const plainText = removeMd(response.text);

        const m = 10;
        const modelRespChunks = Array.from({ length: Math.ceil(plainText.length / m) }, (v, i) =>
            (plainText)?.slice(i * m, i * m + m)
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

        await client.rPush(`user-session:${sessionId}`, JSON.stringify({
            message: plainText,
            role: modelReply.role,
            timestamp: modelReply.timeStamp
        }));

        console.log("Model reply cached in redis!");

        const result = {
            reply: plainText,
            timestamp: modelReply.timeStamp,
            role: "model",
            sessionId
        };

        return result;
    } catch (error) {
        throw error;
    }
}

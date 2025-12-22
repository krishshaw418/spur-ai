import { getRedisClient } from "../lib/redis";
import { GoogleGenAI , type Content} from "@google/genai";
import { chunkText } from "./chunk";
import { prisma } from "../lib/prisma";
import faqs from "../faqs.json";
import removeMd from "remove-markdown";

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
    console.error("apiKey not loaded!");
}

export async function createConversation(userId: string, msg: string, sessionId: string, oldConversation: Content[] | []) {
    const gemini = new GoogleGenAI({
        apiKey
    });
    try {
        const client = await getRedisClient();
        let chat;

        if (oldConversation.length === 0) {
            chat = gemini.chats.create({
                model: "gemini-2.5-flash",
                config: {
                    systemInstruction: `You are a customer support agent for SpurStore. Here is our store's policy information:${faqs} in json format. Use this information to answer customer questions accurately. Always be helpful, friendly, and refer to these exact policies when answering questions about shipping, returns, support hours, etc.`,
                    thinkingConfig: {
                        thinkingBudget: 0
                    },
                }
            });
        } else {
            chat = gemini.chats.create({
                model: "gemini-2.5-flash",
                history: oldConversation,
                config: {
                    systemInstruction:`You are a customer support agent for SpurStore. Here is our store's policy information:${faqs} Use this information to answer customer questions accurately. Always be helpful, friendly, and refer to these exact policies when answering questions about shipping, returns, support hours, etc.`,
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                }
            });
        }

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
        const userMsgChunks = chunkText(msg);

        // new record of user's message
        const newUserMessage = await prisma.message.create({
            data: {
                conversationId: sessionId,
                role: "user"
            }
        })

        // create record of each part into db
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
        await client.rPush(`user-session_${userId}:${sessionId}`, JSON.stringify({
            message: msg,
            role: newUserMessage.role,
            timestamp: newUserMessage.timeStamp
        }));

        console.log("User msg cached in redis!");

        const plainText = removeMd(response.text);
            
        // breakdown model's response into chunks
        const modelRespChunks = chunkText(plainText);

        // new record of model response
        const modelReply = await prisma.message.create({
            data: {
                conversationId: sessionId,
                role: "model"
            }
        });

        // create record of each part into db
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
        await client.rPush(`user-session_${userId}:${sessionId}`, JSON.stringify({
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
    } catch (error) {
        throw error;
    }
}
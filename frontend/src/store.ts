import { create } from 'zustand';
import { ChatState, Message } from './types';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export const getPreviousConversation = async (conversationId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/chat?conversationId=${conversationId}`, {
      withCredentials: true
    });

    const data = await response.data;
    console.log(data);

    return data.chatHistory;

  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
      console.error(error);
    }
  }
}

const fetchLLMResponse = async (userMessage: string): Promise<{ reply: string, timestamp: Date, role: "model", sessionId: string | undefined } | any> => {

  const sessionId = Cookies.get('sessionId');

  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat/message`, {
      message: userMessage,
      sessionId: sessionId
    }, {
      withCredentials: true
    })

    const data = await response.data;

    return data;

  } catch (error: any) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    }
    return error;
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  isSending: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setIsTyping: (isTyping) => set({ isTyping }),
  
  setIsSending: (isSending) => set({ isSending }),

  sendMessage: async (text) => {
    if (!text.trim() || get().isSending) return;

    set({ isSending: true });

    // add user message
    const userMessage: Message = {
      message: text.trim(),
      role: "user",
      timestamp: new Date()
    };

    get().addMessage(userMessage);

    // add llm message
    set({ isTyping: true });
    
    try {
      const llmResponse = await fetchLLMResponse(text.trim());

      const modelMessage: Message = {
        message: llmResponse.reply,
        role: "model",
        timestamp: new Date(llmResponse.timestamp), // Convert string to Date
      };

      get().addMessage(modelMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      set({ isTyping: false, isSending: false });
    }
  },
}));

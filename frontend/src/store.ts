import { create } from 'zustand';
import { ChatState, Message, SidebarState, SessionState, SessionIdState } from './types';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const getPreviousConversation = async (userId: string, conversationId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/chat?userId=${userId}&conversationId=${conversationId}`, {
      withCredentials: true
    });

    const data = await response.data;
    
    return data.chatHistory;

  } catch (error: any) {
    if (!error.response) {
      toast.error("Server is offline. Please try again later.");
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return [];
      }
      toast.error(error.response?.data.message);
    }
    return;
  }
}

const fetchLLMResponse = async (userMessage: string): Promise<{ reply: string, timestamp: Date, role: "model", sessionId: string | undefined } | any> => {

  const id = localStorage.getItem('userId');
  const setId = useSessionStore.getState().setId;

  if (id) {
    const userId = id.slice(0, id.indexOf(':'));
    const sessionId = id.slice(id.indexOf(":") + 1);

    setId(id);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat/message`, {
        message: userMessage,
        sessionId: sessionId,
        userId: userId
      }, {
        withCredentials: true
      })

      const data = await response.data;

      return data;
    } catch (error: any) {
      if (!error.response) {
        toast.error("Server is offline. Please try again later.");
      }
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      return;
    }
  } else {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat/message`, {
        message: userMessage,
      }, {
        withCredentials: true
      })

      const data = await response.data;

      localStorage.setItem('userId', data.userId);
      setId(data.userId);

      return data;

    } catch (error: any) {
      if (!error.response) {
        toast.error("Server is offline. Please try again later.");
      }
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      return;
    }
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

  clearMessages: () => set({
    messages: []
  }),

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

export const useSidebarStore = create<SidebarState>((set) => ({
  open: true,
  setOpen: (open: boolean) => set(({ open: !open })),
  isSelected: false
}))

export const useSessionStore = create<SessionState>((set) => ({
  Id: localStorage.getItem('userId') as string,
  setId: (Id: string) => set(({ Id: Id }))
}))

export const useSessionIdStore = create<SessionIdState>((set) => ({
  sessionIds: [],
  setSessionIds: (sessionIds: {id: string}[]) => set(({ sessionIds: sessionIds }))
}))

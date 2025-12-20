export interface Message {
  message: string;
  conversationId?: string;
  role: "user" | "model";
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isSending: boolean;
  addMessage: (message: Message) => void;
  setIsTyping: (isTyping: boolean) => void;
  setIsSending: (isSending: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
}

import { Chat } from './Chat';
import RootLayout from './Layout';
import { getPreviousConversation } from "./store";
import { Message } from './types';
import { useChatStore, useSessionStore } from './store';
import { useEffect } from 'react';
import ChatSessionStack from './components/ChatSessionStack';

function App() {

  const Id = useSessionStore((state) => state.Id);
  const addMessage = useChatStore.getState().addMessage;
  const clearMessages = useChatStore((state) => state.clearMessages);

  useEffect(() => {
    const loadPreviousChat = async () => {
      if (!Id || !Id.includes(':')) {
        return;
      }

      const userId = Id.slice(0, Id.indexOf(':'));
      const sessionId = Id.slice(Id.indexOf(':') + 1);
      
      if (userId && sessionId) {
        try {
          const messages: Message[] = await getPreviousConversation(userId, sessionId);
          
          if (messages && Array.isArray(messages)) {
            clearMessages();
            if(messages.length === 0) return;
            messages.forEach((msg) => {
              const oldMessage: Message = {
                message: msg.message,
                role: msg.role,
                timestamp: new Date(msg.timestamp),
              };
              addMessage(oldMessage);
            });
          }
        } catch (error) {
          console.error('Error loading previous chat:', error);
        }
      }
    }
    loadPreviousChat();
  }, [Id]);

  return (
    <div className='flex'>
      <ChatSessionStack/>
      <RootLayout>
        <Chat />
      </RootLayout>
    </div>
  )
}

export default App;
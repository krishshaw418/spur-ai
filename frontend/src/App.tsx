import { Chat } from './Chat';
import RootLayout from './Layout';
import { getPreviousConversation } from "./store";
import { Message } from './types';
import { useChatStore, useSessionStore } from './store';
import { useEffect } from 'react';
import ChatSessionStack from './components/ChatSessionStack';

function App() {

  const Id = useSessionStore((state) => state.Id);

  useEffect(() => {
    const loadPreviousChat = async () => {
      const userId = Id.slice(0, Id.indexOf(':'));
      const sessionId = Id.slice(Id.indexOf(':') + 1);
      if (sessionId) {
        const messages: Message[] = await getPreviousConversation(userId, sessionId);
        const addMessage = useChatStore.getState().addMessage;
        messages.forEach((msg) => {
          const oldMessage: Message = {
          message: msg.message,
          role: msg.role,
          timestamp: new Date(msg.timestamp), // Convert string to Date
        };
          addMessage(oldMessage);
        });
      }
    }
    loadPreviousChat()
  }, []);

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

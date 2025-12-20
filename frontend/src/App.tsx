import { Chat } from './Chat';
import RootLayout from './Layout';
import { getPreviousConversation } from "./store";
import Cookies from 'js-cookie';
import { Message } from './types';
import { useChatStore } from './store';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const loadPreviousChat = async () => {
      const sessionId = Cookies.get('sessionId');
      if (sessionId) {
        const messages: Message[] = await getPreviousConversation(sessionId);
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
  <div>
    <RootLayout>
      <Chat />
    </RootLayout>
  </div>
  )
}

export default App;

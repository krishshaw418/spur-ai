import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { Sparkles } from 'lucide-react';
import { useSessionStore, useSidebarStore, getPreviousConversation, useChatStore } from './store';
import { PanelRightOpen, PanelLeftOpen, PlusCircle } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { Message } from './types';

export const Chat = () => {

  const open = useSidebarStore((state) => state.open);
  const setOpen = useSidebarStore((state) => state.setOpen);
  const Id = useSessionStore((state) => state.Id);
  const setId = useSessionStore((state) => state.setId);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className='flex items-center justify-between mx-5'>
          <div className="py-4 flex items-center gap-4 px-5">
            <div onClick={() => setOpen(open)}>
            { open ? <PanelRightOpen size={20}/> : <PanelLeftOpen size={20}/> }
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Spur AI</h1>
              <p className="text-xs text-muted-foreground">Powered by Spur</p>
            </div>
          </div>
          </div>
          <div className='px-5 rounded-lg' onClick={async () => {
            if (Id) {
              const userId = Id.slice(0, Id.indexOf(':'));
                try {
                  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat/new`, {
                  userId
                  }, {
                  withCredentials: true
                });

                const data = response.data;
                console.log(data);
                localStorage.setItem('userId', `${userId}:${data.sessionId}`);
                setId(`${userId}:${data.sessionId}`)
                const msgs: Message[] = await getPreviousConversation(userId, data.sessionId);
                if(msgs) {
                  const addMessage = useChatStore.getState().addMessage;
                  const clearMessages = useChatStore.getState().clearMessages;
                  clearMessages();
                  msgs.forEach((msg) => {
                    const oldSessionMessage: Message = {
                      message: msg.message,
                      role: msg.role,
                      timestamp: new Date(msg.timestamp), // Convert string to Date
                    };
                    addMessage(oldSessionMessage);
                  })
                }
                } catch (error: any) {
                  if (error instanceof AxiosError) {
                    toast.error(error.response?.data.message);
                  }
                  if (error instanceof TypeError) {
                    toast.error(error.message);
                  }
                  return;
                }
              }
            }}>
            <PlusCircle size={20} />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container h-full">
          <MessageList />
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

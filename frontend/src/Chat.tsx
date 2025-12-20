import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { Sparkles } from 'lucide-react';

export const Chat = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-primary/5">
      
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
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
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl mx-auto h-full">
          <MessageList />
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

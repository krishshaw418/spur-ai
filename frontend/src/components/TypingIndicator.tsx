import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-slide-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
        <Bot className="w-4 h-4" />
      </div>

      <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-dots" style={{ animationDelay: '0s' }}></span>
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-dots" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-dots" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

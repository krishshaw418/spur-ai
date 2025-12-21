import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useChatStore } from '@/store';
import { Button } from './ui/button';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MessageInput = () => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isSending = useChatStore((state) => state.isSending);

  const handleSend = async () => {
    if (inputValue.trim() && !isSending) {
      await sendMessage(inputValue);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              className={cn(
                'w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 pr-12',
                'text-sm placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'transition-all duration-200',
                'min-h-[52px] max-h-[200px] overflow-y-auto',
                'scrollbar-invisible'
              )}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSending}
              rows={1}
            />
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isSending || !inputValue.trim()}
            className={cn(
              'h-[52px] w-[52px] rounded-2xl transition-all duration-200',
              'hover:scale-105 active:scale-95'
            )}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

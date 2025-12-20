import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 group animate-slide-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={cn('flex flex-col gap-1 max-w-[70%]', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted text-foreground rounded-tl-sm border border-border'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </div>
        <span className="text-xs text-muted-foreground px-1">
          {
            formatTime(message.timestamp)
          }
        </span>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { MessageBubble } from './MessageBubble';
import { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  otherUser: {
    displayName: string;
    photoURL?: string;
  };
  onLoadMore: () => Promise<void>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  hasMore,
  otherUser,
  onLoadMore
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldScrollToBottom]);

  // Check if user is near bottom to decide whether to auto-scroll
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldScrollToBottom(isNearBottom);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-cmo-text-secondary">Loading messages...</div>
      </div>
    );
  }

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {hasMore && (
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load older messages'}
          </Button>
        </div>
      )}
      
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-cmo-text-secondary mb-2">No messages yet</p>
            <p className="text-sm text-cmo-text-secondary">
              Start a conversation with {otherUser.displayName}
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
            
            return (
              <MessageBubble
                key={message.id}
                message={message}
                otherUserPhoto={otherUser.photoURL}
                otherUserName={otherUser.displayName}
                showAvatar={showAvatar}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
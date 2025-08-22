import React from 'react';
import { format } from 'date-fns';
import { Message } from '../../types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { auth } from '../../lib/firebase';

interface MessageBubbleProps {
  message: Message;
  otherUserPhoto?: string;
  otherUserName?: string;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  otherUserPhoto, 
  otherUserName,
  showAvatar = true 
}) => {
  const isCurrentUser = message.senderId === auth.currentUser?.uid;
  
  return (
    <div className={`flex items-end space-x-2 mb-4 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {showAvatar && !isCurrentUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={otherUserPhoto} />
          <AvatarFallback>
            {otherUserName?.split(' ').map(n => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'ml-auto' : ''}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isCurrentUser
              ? 'bg-cmo-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-cmo-text-primary dark:text-gray-100'
          }`}
        >
          {message.type === 'text' && message.text && (
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          )}
          
          {message.type === 'image' && message.mediaUrl && (
            <div className="max-w-sm">
              <img
                src={message.mediaUrl}
                alt="Shared image"
                className="rounded-lg w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}
          
          {message.type === 'video' && message.mediaUrl && (
            <div className="max-w-sm">
              <video
                src={message.mediaUrl}
                controls
                className="rounded-lg w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}
        </div>
        
        <p className={`text-xs text-cmo-text-secondary mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {format(message.timestamp, 'HH:mm')}
        </p>
      </div>
      
      {showAvatar && isCurrentUser && (
        <div className="w-8 h-8" /> // Placeholder for alignment
      )}
    </div>
  );
};
import React from 'react';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useLocation } from 'wouter';

interface ChatHeaderProps {
  otherUser: {
    displayName: string;
    photoURL?: string;
    isOnline?: boolean;
  };
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ otherUser }) => {
  const [, setLocation] = useLocation();

  return (
    <div className="flex items-center justify-between p-4 border-b border-cmo-border bg-white dark:bg-gray-900">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/messages')}
          className="lg:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUser.photoURL} />
          <AvatarFallback>
            {otherUser.displayName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium text-cmo-text-primary">{otherUser.displayName}</h3>
          {otherUser.isOnline && (
            <p className="text-sm text-green-500">Online</p>
          )}
          {!otherUser.isOnline && (
            <p className="text-sm text-cmo-text-secondary">Last seen recently</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Video className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
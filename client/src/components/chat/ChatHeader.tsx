import React, { useState } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, UserX, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useLocation } from 'wouter';
import { useBlockUser, useBlockingStatus } from '../../hooks/useChat';

interface ChatHeaderProps {
  otherUser: {
    displayName: string;
    photoURL?: string;
    isOnline?: boolean;
  };
  otherUserId?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ otherUser, otherUserId }) => {
  const [, setLocation] = useLocation();
  const { blockUser, unblockUser } = useBlockUser();
  const { isBlockedByMe, isBlockedByThem, loading: blockingLoading } = useBlockingStatus(otherUserId);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBlockUser = async () => {
    if (!otherUserId || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await blockUser(otherUserId);
    } catch (error) {
      console.error('Error blocking user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!otherUserId || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await unblockUser(otherUserId);
    } catch (error) {
      console.error('Error unblocking user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

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
          {isBlockedByMe && (
            <p className="text-sm text-red-500">Blocked</p>
          )}
          {isBlockedByThem && !isBlockedByMe && (
            <p className="text-sm text-red-500">You are blocked</p>
          )}
          {!isBlockedByMe && !isBlockedByThem && otherUser.isOnline && (
            <p className="text-sm text-green-500">Online</p>
          )}
          {!isBlockedByMe && !isBlockedByThem && !otherUser.isOnline && (
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!blockingLoading && otherUserId && (
              <>
                {isBlockedByMe ? (
                  <DropdownMenuItem 
                    onClick={handleUnblockUser}
                    disabled={isProcessing}
                    className="text-green-600"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Unblock User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={handleBlockUser}
                    disabled={isProcessing || isBlockedByThem}
                    className="text-red-600"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Block User
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
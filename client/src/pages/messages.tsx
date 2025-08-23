import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import Header from '../components/layout/header';
import MobileNavigation from '../components/mobile-navigation';
import { useIsMobile } from '../hooks/use-mobile';
import { MessageSquare, Plus, Search, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useConversations, useCreateConversation, useChatUsers, useChat } from '../hooks/useChat';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { auth } from '../lib/firebase';
import { userApiService, UserProfile } from '../lib/userApi';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { Conversation } from '../types/chat';

export const MessagesPage: React.FC = () => {
  const { conversations, loading } = useConversations();
  const { createConversation } = useCreateConversation();
  const { users: chatUsers } = useChatUsers();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [userProfiles, setUserProfiles] = useState<{ [uid: string]: UserProfile }>({});
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ displayName: string; photoURL?: string; isOnline?: boolean } | null>(null);
  const [showChat, setShowChat] = useState(false); // For mobile view

  // Chat hook for the selected conversation
  const {
    messages,
    loading: messagesLoading,
    hasMore,
    sendMessage,
    sendMediaMessage,
    loadMoreMessages
  } = useChat(selectedConversation?.id);


  // Fetch user profiles for all conversation participants
  useEffect(() => {
    const fetchUserProfiles = async () => {
      const userIds = new Set<string>();
      
      conversations.forEach(conversation => {
        conversation.participants.forEach(uid => {
          if (uid !== auth.currentUser?.uid) {
            userIds.add(uid);
          }
        });
      });

      const profiles: { [uid: string]: UserProfile } = {};
      
      for (const uid of Array.from(userIds)) {
        try {
          const chatInfo = await userApiService.getChatUserInfo(uid);
          // Convert chat info to UserProfile format for compatibility
          profiles[uid] = {
            uid: chatInfo.uid,
            firstName: chatInfo.firstName,
            lastName: chatInfo.lastName,
            photoUrl: chatInfo.photoUrl,
            username: chatInfo.username,
            email: '', // Not needed for chat display
            hasBasicInfo: true,
            isActive: false
          } as UserProfile;
        } catch (error) {
          console.error(`Error fetching chat info for user ${uid}:`, error);
        }
      }
      
      setUserProfiles(profiles);
    };

    if (conversations.length > 0) {
      fetchUserProfiles();
    }
  }, [conversations]);

  const handleStartChat = async (otherUserId: string) => {
    try {
      const conversationId = await createConversation(otherUserId);
      // Find the conversation and select it
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        handleSelectConversation(conversation);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Find the other user and fetch their profile
    const otherUserId = conversation.participants.find(
      uid => uid !== auth.currentUser?.uid
    );
    
    if (otherUserId) {
      try {
        const chatUserInfo = await userApiService.getChatUserInfo(otherUserId);
        setSelectedUser({
          displayName: `${chatUserInfo.firstName} ${chatUserInfo.lastName}`.trim(),
          photoURL: chatUserInfo.photoUrl,
          isOnline: false
        });
      } catch (error) {
        console.error('Error fetching selected user info:', error);
        setSelectedUser({
          displayName: `User ${otherUserId.slice(0, 8)}`,
          photoURL: undefined,
          isOnline: false
        });
      }
    }
    
    if (isMobile) {
      setShowChat(true);
    }
  };

  if (isMobile && showChat && selectedConversation && selectedUser) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border border-cmo-border rounded-lg m-4">
            {/* Mobile chat header with back button */}
            <div className="flex items-center justify-between p-4 border-b border-cmo-border bg-white dark:bg-gray-900">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedUser.photoURL} />
                  <AvatarFallback>
                    {selectedUser.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium text-cmo-text-primary">{selectedUser.displayName}</h3>
                  {selectedUser.isOnline && (
                    <p className="text-sm text-green-500">Online</p>
                  )}
                  {!selectedUser.isOnline && (
                    <p className="text-sm text-cmo-text-secondary">Last seen recently</p>
                  )}
                </div>
              </div>
            </div>
            
            <MessageList
              messages={messages}
              loading={messagesLoading}
              hasMore={hasMore}
              otherUser={selectedUser}
              onLoadMore={loadMoreMessages}
            />
            
            <MessageInput
              onSendMessage={sendMessage}
              onSendMedia={sendMediaMessage}
            />
          </div>
        </div>
        
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cmo-bg-main">
      <Header />
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-cmo-primary" />
            <h1 className="text-2xl font-bold text-cmo-text-primary">Messages</h1>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cmo-text-secondary w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {chatUsers.map((user) => (
                    <div
                      key={user.uid}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleStartChat(user.uid)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>
                          {user.displayName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-cmo-text-primary">{user.displayName}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatUsers.length === 0 && (
                    <p className="text-center text-cmo-text-secondary py-4">
                      No users available to chat with
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Split screen layout */}
        <div className="flex bg-white dark:bg-gray-900 rounded-lg border border-cmo-border h-[calc(100vh-8rem)]">
          {/* Left side - Conversations list */}
          <div className="w-1/3 border-r border-cmo-border flex flex-col">
            <div className="p-4 border-b border-cmo-border">
              <h2 className="font-semibold text-cmo-text-primary">Conversations</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <p className="text-cmo-text-secondary">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-cmo-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-cmo-text-primary mb-2">No conversations yet</h3>
                  <p className="text-cmo-text-secondary mb-4">
                    Start your first conversation by clicking "New Chat"
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-cmo-border">
                  {conversations.map((conversation) => {
                    const otherUserId = conversation.participants.find(
                      uid => uid !== auth.currentUser?.uid
                    );
                    
                    const otherUserProfile = otherUserId ? userProfiles[otherUserId] : null;
                    const displayName = otherUserProfile 
                      ? `${otherUserProfile.firstName} ${otherUserProfile.lastName}`
                      : `User ${otherUserId?.slice(0, 8)}`;
                    const avatarUrl = otherUserProfile?.photoUrl || otherUserProfile?.profilePic;
                    
                    const isSelected = selectedConversation?.id === conversation.id;
                    
                    return (
                      <div
                        key={conversation.id}
                        className={`flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={avatarUrl || ""} />
                          <AvatarFallback>
                            {otherUserProfile 
                              ? `${otherUserProfile.firstName?.[0] || ''}${otherUserProfile.lastName?.[0] || ''}`
                              : (otherUserId ? otherUserId.slice(0, 2).toUpperCase() : 'U')
                            }
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-cmo-text-primary truncate">
                              {displayName}
                            </h3>
                            <span className="text-sm text-cmo-text-secondary">
                              {format(conversation.lastMessageTime, 'MMM d')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-cmo-text-secondary truncate">
                            {conversation.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Chat messages */}
          <div className="flex-1 flex flex-col">
            {selectedConversation && selectedUser ? (
              <>
                <ChatHeader otherUser={selectedUser} />
                
                <MessageList
                  messages={messages}
                  loading={messagesLoading}
                  hasMore={hasMore}
                  otherUser={selectedUser}
                  onLoadMore={loadMoreMessages}
                />
                
                <MessageInput
                  onSendMessage={sendMessage}
                  onSendMedia={sendMediaMessage}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-cmo-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-cmo-text-primary mb-2">Select a conversation</h3>
                  <p className="text-cmo-text-secondary">
                    Choose a conversation from the left to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isMobile && <MobileNavigation />}
    </div>
  );
};
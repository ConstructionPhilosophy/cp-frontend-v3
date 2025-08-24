import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../lib/firebase';
import { useChat, useBlockingStatus } from '../hooks/useChat';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { Conversation } from '../types/chat';
import { userApiService, UserProfile } from '../lib/userApi';
import Header from '../components/layout/header';
import MobileNavigation from '../components/mobile-navigation';
import { useIsMobile } from '../hooks/use-mobile';

export const ChatPage: React.FC = () => {
  const [match, params] = useRoute('/chat/:conversationId');
  const conversationId = params?.conversationId;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<{ displayName: string; photoURL?: string; username?: string; isOnline?: boolean } | null>(null);
  const [otherUserProfile, setOtherUserProfile] = useState<UserProfile | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const { isBlockedByMe, isBlockedByThem } = useBlockingStatus(otherUserId || undefined);

  const {
    messages,
    loading: messagesLoading,
    hasMore,
    sendMessage,
    sendMediaMessage,
    loadMoreMessages
  } = useChat(conversationId);

  // Load conversation and other user info
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId || !auth.currentUser) return;

      try {
        const conversationRef = doc(firestore, 'conversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);
        
        if (!conversationSnap.exists()) {
          setLoading(false);
          return;
        }

        const conversationData = {
          id: conversationSnap.id,
          ...conversationSnap.data(),
          lastMessageTime: conversationSnap.data()?.lastMessageTime?.toDate() || new Date(),
        } as Conversation;

        setConversation(conversationData);

        // Find the other user
        const foundOtherUserId = conversationData.participants.find(
          uid => uid !== auth.currentUser?.uid
        );

        if (foundOtherUserId) {
          setOtherUserId(foundOtherUserId);
          try {
            // Fetch real user chat info
            console.log('Fetching chat user info for:', otherUserId);
            const chatUserInfo = await userApiService.getChatUserInfo(foundOtherUserId);
            console.log('Fetched chat user info:', chatUserInfo);
            
            setOtherUser({
              displayName: `${chatUserInfo.firstName} ${chatUserInfo.lastName}`.trim(),
              photoURL: chatUserInfo.photoUrl,
              username: chatUserInfo.username,
              isOnline: false // We'll set this based on actual activity later
            });
          } catch (error) {
            console.error('Error fetching chat user info:', error);
            
            // Fallback to placeholder only if API completely fails
            setOtherUser({
              displayName: `User ${foundOtherUserId.slice(0, 8)}`,
              photoURL: undefined,
              username: undefined,
              isOnline: false
            });
          }
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  if (!match || !conversationId) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-cmo-text-secondary">Conversation not found</p>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    );
  }

  if (loading || !otherUser) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-cmo-text-secondary">Loading conversation...</p>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cmo-bg-main">
      <Header />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border border-cmo-border rounded-lg m-4">
          <ChatHeader otherUser={otherUser} otherUserId={otherUserId || undefined} />
          
          <MessageList
            messages={messages}
            loading={messagesLoading}
            hasMore={hasMore}
            otherUser={otherUser}
            onLoadMore={loadMoreMessages}
          />
          
          <MessageInput
            onSendMessage={sendMessage}
            onSendMedia={sendMediaMessage}
            isBlocked={isBlockedByMe || isBlockedByThem}
            blockMessage={
              isBlockedByMe 
                ? "You blocked this user" 
                : isBlockedByThem 
                ? "You are blocked by this user" 
                : undefined
            }
          />
        </div>
      </div>
      
      {isMobile && <MobileNavigation />}
    </div>
  );
};
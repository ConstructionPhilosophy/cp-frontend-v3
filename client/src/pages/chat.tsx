import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../lib/firebase';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { Conversation } from '../types/chat';
import Header from '../components/layout/header';
import MobileNavigation from '../components/mobile-navigation';
import { useIsMobile } from '../hooks/use-mobile';

export const ChatPage: React.FC = () => {
  const [match, params] = useRoute('/chat/:conversationId');
  const conversationId = params?.conversationId;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<{ displayName: string; photoURL?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

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
        const otherUserId = conversationData.participants.find(
          uid => uid !== auth.currentUser?.uid
        );

        if (otherUserId) {
          // In a real app, you'd fetch user data from your users collection
          // For now, we'll use placeholder data
          setOtherUser({
            displayName: `User ${otherUserId.slice(0, 8)}`,
            photoURL: undefined
          });
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
          <ChatHeader otherUser={otherUser} />
          
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
          />
        </div>
      </div>
      
      {isMobile && <MobileNavigation />}
    </div>
  );
};
import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  doc,
  where,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage, auth } from '../lib/firebase';
import { Message, Conversation, ChatUser } from '../types/chat';

export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Load initial messages
  useEffect(() => {
    if (!conversationId || !auth.currentUser) return;

    const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newMessages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as Message);
      });
      
      setMessages(newMessages.reverse());
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 30);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!conversationId || !lastDoc || !hasMore) return;

    const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      startAfter(lastDoc),
      limit(20)
    );

    const snapshot = await getDocs(q);
    const olderMessages: Message[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      olderMessages.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as Message);
    });

    if (olderMessages.length > 0) {
      setMessages(prev => [...olderMessages.reverse(), ...prev]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 20);
    } else {
      setHasMore(false);
    }
  }, [conversationId, lastDoc, hasMore]);

  // Send text message
  const sendMessage = useCallback(async (text: string) => {
    if (!conversationId || !auth.currentUser || !text.trim()) return;

    const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
    
    await addDoc(messagesRef, {
      senderId: auth.currentUser.uid,
      text: text.trim(),
      type: 'text',
      timestamp: serverTimestamp(),
      status: 'sent'
    });

    // Update conversation last message
    const conversationRef = doc(firestore, `conversations/${conversationId}`);
    await updateDoc(conversationRef, {
      lastMessage: text.trim(),
      lastMessageTime: serverTimestamp(),
      updatedBy: auth.currentUser.uid
    });
  }, [conversationId]);

  // Send media message
  const sendMediaMessage = useCallback(async (file: File, type: 'image' | 'video') => {
    if (!conversationId || !auth.currentUser) return;

    // Upload file to storage
    const storageRef = ref(storage, `chat-media/${conversationId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const mediaUrl = await getDownloadURL(snapshot.ref);

    const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);
    
    await addDoc(messagesRef, {
      senderId: auth.currentUser.uid,
      mediaUrl,
      type,
      timestamp: serverTimestamp(),
      status: 'sent'
    });

    // Update conversation last message
    const conversationRef = doc(firestore, `conversations/${conversationId}`);
    await updateDoc(conversationRef, {
      lastMessage: type === 'image' ? '📷 Image' : '🎥 Video',
      lastMessageTime: serverTimestamp(),
      updatedBy: auth.currentUser.uid
    });
  }, [conversationId]);

  return {
    messages,
    loading,
    hasMore,
    sendMessage,
    sendMediaMessage,
    loadMoreMessages
  };
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let conversationUnsubscribe: (() => void) | null = null;

    const setupConversationListener = (user: any) => {
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationsRef = collection(firestore, 'conversations');
      const q = query(
        conversationsRef,
        where('participants', 'array-contains', user.uid),
        orderBy('lastMessageTime', 'desc')
      );

      conversationUnsubscribe = onSnapshot(q, (snapshot) => {
        const newConversations: Conversation[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          newConversations.push({
            id: doc.id,
            ...data,
            lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
          } as Conversation);
        });
        
        setConversations(newConversations);
        setLoading(false);
      }, (error) => {
        console.error('Error in conversation listener:', error);
        setLoading(false);
      });
    };

    // Set up auth state listener - this handles both initial load and auth changes
    const authUnsubscribe = onAuthStateChanged(auth, (user: any) => {
      // Clean up previous listener
      if (conversationUnsubscribe) {
        conversationUnsubscribe();
        conversationUnsubscribe = null;
      }

      // Set up new listener for this user (or clear if no user)
      setupConversationListener(user);
    });

    return () => {
      if (conversationUnsubscribe) conversationUnsubscribe();
      authUnsubscribe();
    };
  }, []);

  return { conversations, loading };
};

export const useCreateConversation = () => {
  const createConversation = useCallback(async (otherUserId: string): Promise<string> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    const participants = [auth.currentUser.uid, otherUserId].sort();
    
    // Check if conversation already exists
    const conversationsRef = collection(firestore, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', '==', participants)
    );
    
    const existingConversations = await getDocs(q);
    
    if (!existingConversations.empty) {
      return existingConversations.docs[0].id;
    }
    
    // Create new conversation
    const newConversationRef = doc(collection(firestore, 'conversations'));
    await setDoc(newConversationRef, {
      participants,
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      updatedBy: auth.currentUser.uid
    });
    
    return newConversationRef.id;
  }, []);

  return { createConversation };
};

export const useChatUsers = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  // This would typically fetch from your user collection
  // For now, we'll return an empty array as this depends on your user management system
  useEffect(() => {
    // In a real app, you'd query your users collection here
    setUsers([]);
    setLoading(false);
  }, []);

  return { users, loading };
};

// Block/Unblock functionality
export const useBlockUser = () => {
  const blockUser = useCallback(async (targetUid: string): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    if (!auth.currentUser?.uid) throw new Error('User not authenticated');
    await setDoc(doc(firestore, 'users', auth.currentUser.uid, 'blockedUsers', targetUid), {
      blockedAt: serverTimestamp()
    });
  }, []);

  const unblockUser = useCallback(async (targetUid: string): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    if (!auth.currentUser?.uid) throw new Error('User not authenticated');
    await deleteDoc(doc(firestore, 'users', auth.currentUser.uid, 'blockedUsers', targetUid));
  }, []);

  return { blockUser, unblockUser };
};

// Check blocking status with real-time updates
export const useBlockingStatus = (otherUserId?: string) => {
  const [isBlockedByMe, setIsBlockedByMe] = useState(false);
  const [isBlockedByThem, setIsBlockedByThem] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser?.uid || !otherUserId) {
      setLoading(false);
      return;
    }

    let unsubscribeMyBlock: () => void;
    let unsubscribeTheirBlock: () => void;

    // Real-time listener for if I blocked them
    const blockedByMeRef = doc(firestore, 'users', auth.currentUser.uid, 'blockedUsers', otherUserId);
    unsubscribeMyBlock = onSnapshot(blockedByMeRef, (doc) => {
      setIsBlockedByMe(doc.exists());
      setLoading(false);
    }, (error) => {
      console.error('Error listening to my block status:', error);
      setLoading(false);
    });

    // Real-time listener for if they blocked me
    const blockedByThemRef = doc(firestore, 'users', otherUserId, 'blockedUsers', auth.currentUser.uid);
    unsubscribeTheirBlock = onSnapshot(blockedByThemRef, (doc) => {
      setIsBlockedByThem(doc.exists());
    }, (error) => {
      console.error('Error listening to their block status:', error);
    });

    // Cleanup listeners on unmount
    return () => {
      if (unsubscribeMyBlock) unsubscribeMyBlock();
      if (unsubscribeTheirBlock) unsubscribeTheirBlock();
    };
  }, [otherUserId]);

  return { isBlockedByMe, isBlockedByThem, loading };
};
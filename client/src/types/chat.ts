export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  updatedBy: string;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  type: "text" | "image" | "video";
  timestamp: Date;
  status: "sent" | "seen";
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
  photoUrl?: string;
}

export interface ChatUser {
  uid: string;
  displayName: string;
  photoURL?: string;
}
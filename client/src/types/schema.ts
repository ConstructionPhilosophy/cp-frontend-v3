export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  title?: string;
  company?: string;
  bio?: string;
  description?: string;
  points?: number;
  answersCount?: number;
  questionsCount?: number;
  posts?: number;
  views?: number;
  thanks?: number;
  insightful?: number;
  level?: string;
  badges?: string[];
  verified?: boolean;
  createdAt?: Date;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  tags?: string[];
  category?: string;
  space?: string;
  upvotes?: number;
  downvotes?: number;
  answersCount?: number;
  isHelpful?: boolean;
  priority?: 'low' | 'medium' | 'high';
  imageUrl?: string;
}

export interface Answer {
  id: string;
  content: string;
  authorId: string;
  author: User;
  questionId: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  isAccepted?: boolean;
  isHelpful?: boolean;
}

export interface Space {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  questionsCount?: number;
  hashtag?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  count?: number;
}

export interface Vendor {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  category: string;
  location?: string;
  verified?: boolean;
  color?: string;
  initials?: string;
}
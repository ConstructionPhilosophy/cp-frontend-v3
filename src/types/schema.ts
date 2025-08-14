export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  company?: string;
  description?: string;
  points: number;
  answersCount: number;
  questionsCount: number;
  level?: string;
  badges?: string[];
  verified?: boolean;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  space?: string;
  upvotes: number;
  downvotes: number;
  answersCount: number;
  isHelpful?: boolean;
  priority?: 'low' | 'medium' | 'high';
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
  memberCount: number;
  questionsCount: number;
  color?: string;
  icon?: string;
}

export interface Vendor {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  category: string;
  verified?: boolean;
}
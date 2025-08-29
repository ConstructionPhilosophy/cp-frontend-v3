// Forum dummy data for construction and civil engineering platform

export interface ForumTopic {
  id: string;
  name: string;
  color: string;
  postCount: number;
  followerCount: number;
}

export interface ForumUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  title: string;
  reputation: number;
  answersCount: number;
  questionsCount: number;
  isExpert: boolean;
  specialties: string[];
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: ForumUser;
  topics: ForumTopic[];
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  answersCount: number;
  viewsCount: number;
  isAnswered: boolean;
  isSaved: boolean;
  isUpvoted: boolean;
  isDownvoted: boolean;
  mentionedUsers: ForumUser[];
  images?: string[];
}

export interface ForumAnswer {
  id: string;
  content: string;
  authorId: string;
  author: ForumUser;
  postId: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  isUpvoted: boolean;
  isDownvoted: boolean;
  isAccepted: boolean;
  isHelpful: boolean;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  author: ForumUser;
  answerId: string;
  createdAt: string;
  upvotes: number;
  isUpvoted: boolean;
}

// Mock forum topics
export const forumTopics: ForumTopic[] = [
  { id: "1", name: "Foundation & Structural", color: "bg-blue-100 text-blue-800", postCount: 245, followerCount: 1200 },
  { id: "2", name: "Concrete Work", color: "bg-gray-100 text-gray-800", postCount: 189, followerCount: 980 },
  { id: "3", name: "Building Permits", color: "bg-green-100 text-green-800", postCount: 156, followerCount: 750 },
  { id: "4", name: "Electrical Systems", color: "bg-yellow-100 text-yellow-800", postCount: 134, followerCount: 650 },
  { id: "5", name: "Plumbing & HVAC", color: "bg-purple-100 text-purple-800", postCount: 123, followerCount: 590 },
  { id: "6", name: "Roofing", color: "bg-red-100 text-red-800", postCount: 98, followerCount: 480 },
  { id: "7", name: "Project Management", color: "bg-indigo-100 text-indigo-800", postCount: 87, followerCount: 420 },
  { id: "8", name: "Cost Estimation", color: "bg-pink-100 text-pink-800", postCount: 76, followerCount: 380 },
  { id: "9", name: "Safety Regulations", color: "bg-orange-100 text-orange-800", postCount: 65, followerCount: 340 },
  { id: "10", name: "Renovation & Repair", color: "bg-teal-100 text-teal-800", postCount: 54, followerCount: 290 }
];

// Mock forum users
export const forumUsers: ForumUser[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    username: "structural_expert",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c88c?w=150&h=150&fit=crop&crop=face",
    title: "Structural Engineer",
    reputation: 2450,
    answersCount: 187,
    questionsCount: 23,
    isExpert: true,
    specialties: ["Foundation & Structural", "Concrete Work"]
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    username: "contractor_mike",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    title: "General Contractor",
    reputation: 1890,
    answersCount: 145,
    questionsCount: 34,
    isExpert: true,
    specialties: ["Project Management", "Cost Estimation"]
  },
  {
    id: "3",
    name: "Emma Thompson",
    username: "permit_pro",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    title: "Building Inspector",
    reputation: 1650,
    answersCount: 98,
    questionsCount: 12,
    isExpert: true,
    specialties: ["Building Permits", "Safety Regulations"]
  },
  {
    id: "4",
    name: "James Wilson",
    username: "electrical_james",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    title: "Electrical Engineer",
    reputation: 1420,
    answersCount: 89,
    questionsCount: 18,
    isExpert: true,
    specialties: ["Electrical Systems"]
  },
  {
    id: "5",
    name: "Lisa Johnson",
    username: "roof_specialist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    title: "Roofing Contractor",
    reputation: 1280,
    answersCount: 76,
    questionsCount: 21,
    isExpert: true,
    specialties: ["Roofing", "Renovation & Repair"]
  },
  {
    id: "6",
    name: "David Kim",
    username: "plumbing_dave",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    title: "Plumbing & HVAC Specialist",
    reputation: 980,
    answersCount: 54,
    questionsCount: 15,
    isExpert: false,
    specialties: ["Plumbing & HVAC"]
  }
];

// Mock forum posts
export const forumPosts: ForumPost[] = [
  {
    id: "1",
    title: "Foundation cracks appeared after 6 months - Normal settling or structural issue?",
    content: "I noticed some hairline cracks in my basement foundation wall. The house is only 6 months old. Are these normal settling cracks or should I be concerned? The cracks are about 1/8 inch wide and run vertically for about 2 feet.",
    authorId: "6",
    author: forumUsers[5],
    topics: [forumTopics[0], forumTopics[1]],
    createdAt: "2025-01-29T08:30:00Z",
    updatedAt: "2025-01-29T08:30:00Z",
    upvotes: 23,
    downvotes: 2,
    answersCount: 5,
    viewsCount: 189,
    isAnswered: true,
    isSaved: false,
    isUpvoted: false,
    isDownvoted: false,
    mentionedUsers: [forumUsers[0]],
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"]
  },
  {
    id: "2",
    title: "Best practices for concrete curing in winter conditions?",
    content: "We have a large concrete pour scheduled for next week and temperatures are expected to drop below freezing. What are the best practices for concrete curing in cold weather? Should we use heated enclosures or additives?",
    authorId: "2",
    author: forumUsers[1],
    topics: [forumTopics[1], forumTopics[6]],
    createdAt: "2025-01-29T06:15:00Z",
    updatedAt: "2025-01-29T06:15:00Z",
    upvotes: 31,
    downvotes: 0,
    answersCount: 8,
    viewsCount: 245,
    isAnswered: true,
    isSaved: true,
    isUpvoted: true,
    isDownvoted: false,
    mentionedUsers: [forumUsers[0], forumUsers[1]],
    images: ["https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop"]
  },
  {
    id: "3",
    title: "Permit requirements for adding a second story?",
    content: "Looking to add a second story to my single-story home. What permits are typically required and what should I expect in terms of timeline and inspection process?",
    authorId: "5",
    author: forumUsers[4],
    topics: [forumTopics[2], forumTopics[6]],
    createdAt: "2025-01-28T16:45:00Z",
    updatedAt: "2025-01-28T16:45:00Z",
    upvotes: 18,
    downvotes: 1,
    answersCount: 3,
    viewsCount: 156,
    isAnswered: false,
    isSaved: false,
    isUpvoted: false,
    isDownvoted: false,
    mentionedUsers: [forumUsers[2]],
  },
  {
    id: "4",
    title: "Electrical code updates for 2025 - What contractors need to know",
    content: "There have been some significant updates to the electrical code this year. Can someone summarize the key changes that affect residential construction?",
    authorId: "3",
    author: forumUsers[2],
    topics: [forumTopics[3], forumTopics[8]],
    createdAt: "2025-01-28T14:20:00Z",
    updatedAt: "2025-01-28T14:20:00Z",
    upvotes: 42,
    downvotes: 3,
    answersCount: 12,
    viewsCount: 378,
    isAnswered: true,
    isSaved: true,
    isUpvoted: false,
    isDownvoted: false,
    mentionedUsers: [forumUsers[3]],
  },
  {
    id: "5",
    title: "Cost estimation for kitchen renovation - Am I being overcharged?",
    content: "Got a quote for $45,000 for a kitchen renovation including cabinets, countertops, and appliances. Does this seem reasonable for a 200 sq ft kitchen? What should I be looking out for?",
    authorId: "4",
    author: forumUsers[3],
    topics: [forumTopics[7], forumTopics[9]],
    createdAt: "2025-01-28T11:10:00Z",
    updatedAt: "2025-01-28T11:10:00Z",
    upvotes: 15,
    downvotes: 0,
    answersCount: 7,
    viewsCount: 234,
    isAnswered: false,
    isSaved: false,
    isUpvoted: true,
    isDownvoted: false,
    mentionedUsers: [forumUsers[1]],
  },
  {
    id: "6",
    title: "Roof leak during heavy rain - Emergency repair vs full replacement?",
    content: "Discovered a significant roof leak during yesterday's storm. Water is coming through the ceiling in the living room. Should I do emergency repairs or is it time for a full roof replacement? The roof is about 15 years old.",
    authorId: "1",
    author: forumUsers[0],
    topics: [forumTopics[5], forumTopics[9]],
    createdAt: "2025-01-27T20:30:00Z",
    updatedAt: "2025-01-27T20:30:00Z",
    upvotes: 28,
    downvotes: 1,
    answersCount: 9,
    viewsCount: 312,
    isAnswered: true,
    isSaved: false,
    isUpvoted: false,
    isDownvoted: false,
    mentionedUsers: [forumUsers[4]],
    images: ["https://images.unsplash.com/photo-1558219549-c7e9fa2a2f36?w=600&h=400&fit=crop"]
  }
];

// Mock answers and replies
export const forumAnswers: ForumAnswer[] = [
  {
    id: "1",
    content: "Based on your description, these sound like normal settling cracks. Hairline vertical cracks are typically not a structural concern. However, I'd recommend monitoring them for any expansion over the next few months. If they grow wider than 1/4 inch or develop horizontal patterns, that's when you should contact a structural engineer.",
    authorId: "1",
    author: forumUsers[0],
    postId: "1",
    createdAt: "2025-01-29T09:15:00Z",
    updatedAt: "2025-01-29T09:15:00Z",
    upvotes: 15,
    downvotes: 0,
    isUpvoted: false,
    isDownvoted: false,
    isAccepted: true,
    isHelpful: true,
    replies: []
  },
  {
    id: "2",
    content: "For winter concrete pours, I recommend using Type III (high early strength) cement with calcium chloride accelerator. Keep the concrete temperature above 50°F for at least 72 hours. Heated enclosures work well, but make sure to maintain consistent temperature to avoid thermal shock.",
    authorId: "1",
    author: forumUsers[0],
    postId: "2",
    createdAt: "2025-01-29T07:00:00Z",
    updatedAt: "2025-01-29T07:00:00Z",
    upvotes: 22,
    downvotes: 1,
    isUpvoted: true,
    isDownvoted: false,
    isAccepted: true,
    isHelpful: true,
    replies: []
  }
];

// Trending and statistics data
export const trendingTopics = forumTopics.slice(0, 5);
export const mostAnsweredUsers = forumUsers.filter(u => u.isExpert).sort((a, b) => b.answersCount - a.answersCount).slice(0, 5);
export const trendingPosts = forumPosts.sort((a, b) => (b.upvotes + b.viewsCount) - (a.upvotes + a.viewsCount)).slice(0, 3);
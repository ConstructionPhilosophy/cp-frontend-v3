import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { 
  TrendingUp, 
  Award, 
  Users, 
  MessageCircle, 
  Eye,
  Crown,
  Star,
  Flame
} from "lucide-react";
import { trendingTopics, mostAnsweredUsers, trendingPosts } from "../../lib/forum-data";

export default function ForumSidebar() {
  return (
    <div className="space-y-4">
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cmo-primary" />
            <h3 className="font-medium text-sm text-cmo-text-primary">Trending Topics</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={topic.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center justify-center w-5 h-5 bg-cmo-primary/10 rounded text-xs font-medium text-cmo-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-cmo-text-primary truncate">{topic.name}</p>
                    <p className="text-xs text-cmo-text-secondary">{topic.postCount} posts</p>
                  </div>
                </div>
                <Flame className="w-3 h-3 text-orange-500" />
              </div>
            ))}
          </div>
          <Button variant="link" className="text-cmo-primary text-xs hover:underline p-0 h-auto mt-3 w-full">
            View all topics
          </Button>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cmo-primary" />
            <h3 className="font-medium text-sm text-cmo-text-primary">Top Contributors</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {mostAnsweredUsers.map((user, index) => (
              <div key={user.id} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 cursor-pointer transition-colors">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-cmo-text-primary truncate">{user.name}</p>
                    {user.isExpert && (
                      <Star className="w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-cmo-text-secondary">{user.answersCount} answers • {user.reputation} reputation</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="link" className="text-cmo-primary text-xs hover:underline p-0 h-auto mt-3 w-full">
            View leaderboard
          </Button>
        </CardContent>
      </Card>

      {/* Trending Questions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-cmo-primary" />
            <h3 className="font-medium text-sm text-cmo-text-primary">Hot Questions</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {trendingPosts.map((post) => (
              <div key={post.id} className="hover:bg-gray-50 rounded-lg p-2 cursor-pointer transition-colors">
                <h4 className="text-xs font-medium text-cmo-text-primary line-clamp-2 mb-1">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-cmo-text-secondary">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.viewsCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.answersCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="link" className="text-cmo-primary text-xs hover:underline p-0 h-auto mt-3 w-full">
            See more questions
          </Button>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cmo-primary" />
            <h3 className="font-medium text-sm text-cmo-text-primary">Community Stats</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-cmo-text-secondary">Total Questions</span>
              <span className="text-xs font-medium text-cmo-text-primary">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cmo-text-secondary">Total Answers</span>
              <span className="text-xs font-medium text-cmo-text-primary">3,891</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cmo-text-secondary">Active Members</span>
              <span className="text-xs font-medium text-cmo-text-primary">2,356</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cmo-text-secondary">Expert Contributors</span>
              <span className="text-xs font-medium text-cmo-text-primary">89</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm text-cmo-text-primary mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full text-xs h-8 justify-start">
              <Users className="w-3 h-3 mr-2" />
              Find Experts
            </Button>
            <Button variant="outline" className="w-full text-xs h-8 justify-start">
              <TrendingUp className="w-3 h-3 mr-2" />
              Browse Topics
            </Button>
            <Button variant="outline" className="w-full text-xs h-8 justify-start">
              <Award className="w-3 h-3 mr-2" />
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { 
  X, 
  Plus, 
  Search, 
  ImageIcon, 
  AtSign,
  Tag
} from "lucide-react";
import { forumTopics, forumUsers, ForumPost, ForumTopic, ForumUser } from "../../lib/forum-data";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (post: ForumPost) => void;
}

export default function CreatePostModal({ open, onOpenChange, onPostCreated }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<ForumTopic[]>([]);
  const [mentionedUsers, setMentionedUsers] = useState<ForumUser[]>([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [showTopicSearch, setShowTopicSearch] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const currentUser = forumUsers[5]; // Using David Kim as current user

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    const newPost: ForumPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      content: content.trim(),
      authorId: currentUser.id,
      author: currentUser,
      topics: selectedTopics,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      answersCount: 0,
      viewsCount: 0,
      isAnswered: false,
      isSaved: false,
      isUpvoted: false,
      isDownvoted: false,
      mentionedUsers: mentionedUsers,
    };

    onPostCreated(newPost);
    
    // Reset form
    setTitle("");
    setContent("");
    setSelectedTopics([]);
    setMentionedUsers([]);
    setNewTopicName("");
  };

  const addTopic = (topic: ForumTopic) => {
    if (!selectedTopics.find(t => t.id === topic.id)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
    setShowTopicSearch(false);
    setTopicSearchQuery("");
  };

  const createNewTopic = () => {
    if (!newTopicName.trim()) return;
    
    const newTopic: ForumTopic = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTopicName.trim(),
      color: "bg-blue-100 text-blue-800",
      postCount: 1,
      followerCount: 0
    };
    
    addTopic(newTopic);
    setNewTopicName("");
  };

  const removeTopic = (topicId: string) => {
    setSelectedTopics(selectedTopics.filter(t => t.id !== topicId));
  };

  const addMentionedUser = (user: ForumUser) => {
    if (!mentionedUsers.find(u => u.id === user.id)) {
      setMentionedUsers([...mentionedUsers, user]);
    }
    setShowUserSearch(false);
    setUserSearchQuery("");
  };

  const removeMentionedUser = (userId: string) => {
    setMentionedUsers(mentionedUsers.filter(u => u.id !== userId));
  };

  const filteredTopics = forumTopics.filter(topic =>
    topic.name.toLowerCase().includes(topicSearchQuery.toLowerCase())
  );

  const filteredUsers = forumUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Ask a Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-cmo-text-primary mb-2">
              Question Title
            </label>
            <Input
              placeholder="What's your construction or civil engineering question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              data-testid="input-post-title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-cmo-text-primary mb-2">
              Describe your question
            </label>
            <Textarea
              placeholder="Provide details about your question. Include any relevant context, what you've tried, and what specific help you need..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full"
              data-testid="textarea-post-content"
            />
          </div>

          {/* Topics */}
          <div>
            <label className="block text-sm font-medium text-cmo-text-primary mb-2">
              Topics (Tags)
            </label>
            <div className="space-y-2">
              {selectedTopics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map((topic) => (
                    <Badge
                      key={topic.id}
                      className={`${topic.color} flex items-center gap-1`}
                    >
                      {topic.name}
                      <button
                        onClick={() => removeTopic(topic.id)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowTopicSearch(!showTopicSearch)}
                    className="w-full justify-start text-sm h-9"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Add topics...
                  </Button>
                  
                  {showTopicSearch && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      <div className="p-2 border-b">
                        <Input
                          placeholder="Search topics..."
                          value={topicSearchQuery}
                          onChange={(e) => setTopicSearchQuery(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredTopics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => addTopic(topic)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                          >
                            <Badge className={`${topic.color} mr-2`}>
                              {topic.name}
                            </Badge>
                            <span className="text-xs text-cmo-text-secondary">
                              {topic.postCount} posts
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="p-2 border-t">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Create new topic..."
                            value={newTopicName}
                            onChange={(e) => setNewTopicName(e.target.value)}
                            className="text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                createNewTopic();
                              }
                            }}
                          />
                          <Button
                            onClick={createNewTopic}
                            size="sm"
                            disabled={!newTopicName.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mention Users */}
          <div>
            <label className="block text-sm font-medium text-cmo-text-primary mb-2">
              Mention Experts
            </label>
            <div className="space-y-2">
              {mentionedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {mentionedUsers.map((user) => (
                    <Badge
                      key={user.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      @{user.username}
                      <button
                        onClick={() => removeMentionedUser(user.id)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowUserSearch(!showUserSearch)}
                  className="w-full justify-start text-sm h-9"
                >
                  <AtSign className="w-4 h-4 mr-2" />
                  Mention experts...
                </Button>
                
                {showUserSearch && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div className="p-2 border-b">
                      <Input
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => addMentionedUser(user)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-cmo-text-secondary">
                              @{user.username} • {user.title}
                            </p>
                          </div>
                          {user.isExpert && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              Expert
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <ImageIcon className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-post"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim()}
                className="bg-cmo-primary hover:bg-cmo-primary/90"
                data-testid="button-submit-post"
              >
                Post Question
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
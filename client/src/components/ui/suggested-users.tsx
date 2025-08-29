import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { userApiService, UserProfile } from "../../lib/userApi";

export default function SuggestedUsers() {
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);
  const [followingStatus, setFollowingStatus] = useState<{[key: string]: boolean}>({});
  const [suggestionFollowLoading, setSuggestionFollowLoading] = useState<{[key: string]: boolean}>({});

  // Load suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const suggestionsData = await userApiService.getUserSuggestions();
        setSuggestions(suggestionsData || []);
      } catch (error) {
        console.error('Error loading suggestions:', error);
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  return (
    <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm text-cmo-text-primary">
          Suggested for You
        </h3>
        <Button
          variant="link"
          className="text-cmo-primary text-xs hover:underline p-0 h-auto"
        >
          See all
        </Button>
      </div>

      <div className="space-y-2">
        {suggestionsLoading ? (
          // Loading state
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-cmo-text-secondary ml-2">Loading...</span>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.slice(0, 3).map((person) => (
            <div key={person.uid} className="flex items-center gap-3">
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
                onClick={() => {
                  const userIdentifier = person.username && person.username.trim() !== '' ? person.username : person.uid;
                  window.open(`/u/${userIdentifier}`, '_blank');
                }}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={person.photoUrl || person.profilePic} />
                  <AvatarFallback className="text-xs">
                    {(person.firstName?.[0] || '') + (person.lastName?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-cmo-text-primary truncate">
                    {person.firstName} {person.lastName}
                  </p>
                  <p className="text-xs text-cmo-text-secondary truncate">
                    {person.title || person.positionDesignation || 'Professional'}
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                className={`text-xs px-2 py-1 h-6 ${
                  followingStatus[person.uid] 
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                data-testid="button-follow-suggestion"
                disabled={suggestionFollowLoading[person.uid]}
                onClick={async (e) => {
                  e.stopPropagation();
                  if (suggestionFollowLoading[person.uid]) return;
                  
                  setSuggestionFollowLoading(prev => ({ ...prev, [person.uid]: true }));
                  
                  try {
                    if (followingStatus[person.uid]) {
                      await userApiService.unfollowUser(person.uid);
                      setFollowingStatus(prev => ({ ...prev, [person.uid]: false }));
                    } else {
                      await userApiService.followUser(person.uid);
                      setFollowingStatus(prev => ({ ...prev, [person.uid]: true }));
                    }
                  } catch (error) {
                    console.error('Error following/unfollowing user:', error);
                  } finally {
                    setSuggestionFollowLoading(prev => ({ ...prev, [person.uid]: false }));
                  }
                }}
              >
                {suggestionFollowLoading[person.uid] ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : followingStatus[person.uid] ? (
                  'Following'
                ) : (
                  'Follow'
                )}
              </Button>
            </div>
          ))
        ) : (
          <p className="text-xs text-cmo-text-secondary text-center py-4">
            No suggestions available
          </p>
        )}
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { 
  X, 
  Image as ImageIcon, 
  Smile
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

interface NewsPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export default function NewsPostModal({
  isOpen,
  onClose,
  onPostCreated,
}: NewsPostModalProps) {
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + images.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload up to 5 images per post",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!headline.trim() || !content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add both headline and content",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPosting(true);
      const token = await user?.getIdToken();
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 
        'https://cp-backend-service-test-972540571952.asia-south1.run.app';

      const formData = new FormData();
      formData.append('headline', headline);
      formData.append('content', content);
      
      // Add multiple images
      images.forEach((image, index) => {
        formData.append('newsImage', image);
      });

      const response = await fetch(`${apiBaseUrl}/news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      toast({
        title: "News Posted!",
        description: "Your news has been shared successfully",
      });

      // Reset form and close modal
      setHeadline("");
      setContent("");
      setImages([]);
      onClose();
      onPostCreated();
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Post Failed",
        description: "Failed to post news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    if (!isPosting) {
      setHeadline("");
      setContent("");
      setImages([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden p-0" aria-describedby="news-post-modal">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={userProfile?.profilePic || userProfile?.photoUrl || user?.photoURL || ""} />
                <AvatarFallback>
                  {userProfile?.firstName?.charAt(0) || user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  {userProfile?.lastName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-sm font-medium">
                  {userProfile?.firstName && userProfile?.lastName 
                    ? `${userProfile.firstName} ${userProfile.lastName}`
                    : user?.displayName || "User"}
                </DialogTitle>
                <p className="text-xs text-gray-600">Post to Anyone</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isPosting}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-4 py-3 flex-1 overflow-y-auto">
          <div className="space-y-3">
            {/* Headline */}
            <Input
              placeholder="Add a headline..."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="text-sm font-medium border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-sm"
              disabled={isPosting}
              data-testid="input-modal-headline"
            />

            {/* Content Editor */}
            <Textarea
              placeholder="What do you want to talk about?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none border-none px-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-sm"
              disabled={isPosting}
              data-testid="textarea-modal-content"
            />

            {/* Image Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={isPosting}
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded-full"
                      data-testid={`button-remove-image-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 p-1.5"
                disabled={isPosting}
                onClick={() => document.getElementById('image-upload')?.click()}
                data-testid="button-add-images"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isPosting}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 p-1.5"
                disabled={isPosting}
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                onClick={handlePost}
                disabled={!headline.trim() || !content.trim() || isPosting}
                size="sm"
                className="px-3 py-1.5 text-sm"
                data-testid="button-modal-post"
              >
                {isPosting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
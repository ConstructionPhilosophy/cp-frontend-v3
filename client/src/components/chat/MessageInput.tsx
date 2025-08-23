import React, { useState, useRef } from 'react';
import { Send, Image, Video, Paperclip } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  onSendMedia: (file: File, type: 'image' | 'video') => Promise<void>;
  disabled?: boolean;
  isBlocked?: boolean;
  blockMessage?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendMedia,
  disabled = false,
  isBlocked = false,
  blockMessage = "Messaging is disabled"
}) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending || disabled || isBlocked) return;

    setSending(true);
    try {
      await onSendMessage(text);
      setText('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Determine file type
    let mediaType: 'image' | 'video';
    if (file.type.startsWith('image/')) {
      mediaType = 'image';
    } else if (file.type.startsWith('video/')) {
      mediaType = 'video';
    } else {
      toast({
        title: "Unsupported file type",
        description: "Please select an image or video file.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      console.log('Uploading file:', file.name, 'Type:', mediaType, 'Size:', file.size);
      await onSendMedia(file, mediaType);
      toast({
        title: "Media sent successfully",
        description: "Your file has been shared.",
      });
    } catch (error: any) {
      console.error('Error sending media:', error);
      let errorMessage = "Please try again.";
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = "Upload permission denied. Please check Firebase Storage rules.";
      } else if (error.code === 'storage/canceled') {
        errorMessage = "Upload was canceled.";
      } else if (error.code === 'storage/unknown') {
        errorMessage = "Unknown upload error occurred.";
      }
      
      toast({
        title: "Failed to send media",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSending(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-4 border-t border-cmo-border bg-white dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <div className="relative">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              disabled={disabled || sending || isBlocked}
              className="pr-20 min-h-[40px] max-h-32 resize-none"
              rows={1}
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || sending || isBlocked}
                className="h-8 w-8 p-0 text-cmo-text-secondary hover:text-cmo-primary"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={!text.trim() || disabled || sending || isBlocked}
          className="h-10 w-10 p-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
      
      {isBlocked && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{blockMessage}</p>
        </div>
      )}
    </div>
  );
};
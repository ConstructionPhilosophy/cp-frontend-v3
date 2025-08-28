import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
  onApplicationSubmitted?: () => void;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  onApplicationSubmitted,
}: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }

      setResumeFile(file);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    // Reset the input
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please provide a cover letter for your application",
        variant: "destructive",
      });
      return;
    }

    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const token = await user.getIdToken();
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 
        'https://cp-backend-service-test-972540571952.asia-south1.run.app';

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resumeFile);

      console.log('Submitting job application:', {
        jobId,
        coverLetter: coverLetter.substring(0, 50) + '...',
        resumeFileName: resumeFile.name,
        resumeSize: resumeFile.size
      });

      const response = await fetch(`${apiBaseUrl}/apply-job`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to submit application: ${response.status} ${errorData}`);
      }

      const result = await response.json();
      console.log('Application submitted successfully:', result);

      toast({
        title: "Application Submitted!",
        description: `Your application for ${jobTitle || 'this job'} has been submitted successfully.`,
      });

      // Reset form
      setCoverLetter("");
      setResumeFile(null);
      
      // Close modal and notify parent
      onClose();
      onApplicationSubmitted?.();
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Application Failed",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCoverLetter("");
      setResumeFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Apply for Job
          </DialogTitle>
          {jobTitle && (
            <p className="text-sm text-gray-600 mt-1">
              {jobTitle}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="text-sm font-medium">
              Cover Letter <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell the employer why you're the perfect fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[100px] resize-y"
              disabled={isSubmitting}
              data-testid="textarea-cover-letter"
            />
            <p className="text-xs text-gray-500">
              {coverLetter.length}/1000 characters
            </p>
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Resume <span className="text-red-500">*</span>
            </Label>
            
            {!resumeFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload your resume
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  PDF, DOC, DOCX (Max 10MB)
                </p>
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  disabled={isSubmitting}
                  data-testid="button-upload-resume"
                >
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {resumeFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isSubmitting}
                  data-testid="button-remove-resume"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              data-testid="button-cancel-application"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !coverLetter.trim() || !resumeFile}
              data-testid="button-submit-application"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
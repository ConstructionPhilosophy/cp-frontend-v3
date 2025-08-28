import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/layout/header';
import { useAuth } from '../hooks/useAuth';

interface JobFormData {
  title: string;
  company: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  salaryRange: string;
  skills: string[];
  experience: string;
  industry: string;
  deadline: string;
  qualifications: string;
  numberOfVacancies: number;
}

const PostJobPage = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'full-time',
    salaryRange: '',
    skills: [],
    experience: '',
    industry: 'Construction',
    deadline: '',
    qualifications: '',
    numberOfVacancies: 1
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (field: keyof JobFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.salaryRange.trim()) newErrors.salaryRange = 'Salary range is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience requirement is required';
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
    if (!formData.deadline) newErrors.deadline = 'Application deadline is required';
    if (formData.numberOfVacancies < 1) newErrors.numberOfVacancies = 'Number of vacancies must be at least 1';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';

    // Validate deadline is in the future
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post a job.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await user.getIdToken();
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://cp-backend-service-test-972540571952.asia-south1.run.app';
      
      // Format deadline as ISO string
      const deadlineISO = new Date(formData.deadline).toISOString();
      
      const response = await fetch(`${apiBaseUrl}/employer/post-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          deadline: deadlineISO
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to post job: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const result = await response.json();
      
      toast({
        title: "Job Posted Successfully",
        description: "Your job posting has been published and is now visible to candidates.",
      });

      // Navigate back to jobs page
      setLocation('/jobs');
      
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error Posting Job",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-cmo-bg-main">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/jobs')}
            className="mb-4"
            data-testid="button-back-to-jobs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          
          <h1 className="text-2xl font-bold text-cmo-text-primary">Post a New Job</h1>
          <p className="text-cmo-text-secondary mt-1">
            Fill out the details below to post your job opening
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Civil Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                    data-testid="input-job-title"
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    placeholder="e.g. BuildSmart Pvt Ltd"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={errors.company ? "border-red-500" : ""}
                    data-testid="input-company-name"
                  />
                  {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                  data-testid="textarea-job-description"
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Location and Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Chennai"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={errors.location ? "border-red-500" : ""}
                    data-testid="input-location"
                  />
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Job Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger data-testid="select-job-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger data-testid="select-industry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Salary and Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Salary Range *</Label>
                  <Input
                    id="salaryRange"
                    placeholder="e.g. ₹8L - ₹12L"
                    value={formData.salaryRange}
                    onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                    className={errors.salaryRange ? "border-red-500" : ""}
                    data-testid="input-salary-range"
                  />
                  {errors.salaryRange && <p className="text-sm text-red-500">{errors.salaryRange}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Required *</Label>
                  <Input
                    id="experience"
                    placeholder="e.g. 5+ years"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className={errors.experience ? "border-red-500" : ""}
                    data-testid="input-experience"
                  />
                  {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Required Skills *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a skill (e.g. AutoCAD)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    data-testid="input-add-skill"
                  />
                  <Button type="button" onClick={addSkill} data-testid="button-add-skill">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                          data-testid={`button-remove-skill-${index}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {errors.skills && <p className="text-sm text-red-500">{errors.skills}</p>}
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications *</Label>
                <Textarea
                  id="qualifications"
                  placeholder="e.g. B.E/B.Tech in Civil Engineering, relevant certifications..."
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange('qualifications', e.target.value)}
                  className={errors.qualifications ? "border-red-500" : ""}
                  data-testid="textarea-qualifications"
                />
                {errors.qualifications && <p className="text-sm text-red-500">{errors.qualifications}</p>}
              </div>

              {/* Deadline and Vacancies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    min={today}
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className={errors.deadline ? "border-red-500" : ""}
                    data-testid="input-deadline"
                  />
                  {errors.deadline && <p className="text-sm text-red-500">{errors.deadline}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfVacancies">Number of Vacancies *</Label>
                  <Input
                    id="numberOfVacancies"
                    type="number"
                    min="1"
                    value={formData.numberOfVacancies}
                    onChange={(e) => handleInputChange('numberOfVacancies', parseInt(e.target.value) || 1)}
                    className={errors.numberOfVacancies ? "border-red-500" : ""}
                    data-testid="input-vacancies"
                  />
                  {errors.numberOfVacancies && <p className="text-sm text-red-500">{errors.numberOfVacancies}</p>}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/jobs')}
                  disabled={isSubmitting}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="button-submit-job"
                >
                  {isSubmitting ? 'Posting Job...' : 'Post Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
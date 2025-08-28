import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, MapPin, Clock, Briefcase, Calendar, Users, Eye, Building, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/layout/header';
import { useAuth } from '../hooks/useAuth';

interface JobDetails {
  jobId: string;
  title: string;
  company: string;
  postedBy: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  salaryRange: string;
  skills: string[];
  experience: string;
  industry: string;
  postedAt: string;
  deadline: string;
  qualifications: string;
  numberOfVacancies: number;
  isOwner?: boolean;
  alreadyApplied?: boolean;
  applicationId?: string;
  applicationStatus?: 'applied' | 'shortlisted' | 'rejected' | 'hired';
  totalViews?: number;
  totalApplications?: number;
}

const JobDetailsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!jobId) {
      setLocation('/jobs');
      return;
    }

    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://cp-backend-service-test-972540571952.asia-south1.run.app';
      
      const response = await fetch(`${apiBaseUrl}/job?id=${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.status}`);
      }

      const jobData = await response.json();
      setJob(jobData);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast({
        title: "Error Loading Job",
        description: "Failed to load job details. Please try again.",
        variant: "destructive",
      });
      // Navigate back to jobs page if job not found
      setLocation('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async () => {
    if (!job || !user) return;

    setApplying(true);
    try {
      const token = await user.getIdToken();
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://cp-backend-service-test-972540571952.asia-south1.run.app';
      
      const response = await fetch(`${apiBaseUrl}/job/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: job.jobId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to apply for job: ${response.status}`);
      }

      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully!",
      });

      // Refresh job details to update application status
      await fetchJobDetails();
    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: "Application Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently posted';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently posted';
    
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (type?: string) => {
    if (!type) return 'bg-green-100 text-green-700 border-green-200'; // Default to full-time styling
    
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-700 border-green-200';
      case 'part-time': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contract': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'freelance': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-700';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'hired': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cmo-primary mx-auto"></div>
            <p className="mt-4 text-cmo-text-secondary">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-cmo-text-secondary">Job not found</p>
            <Button onClick={() => setLocation('/jobs')} className="mt-4">
              Back to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-cmo-text-primary mb-2">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-lg text-cmo-text-secondary mb-4">
                      <Building className="w-5 h-5" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={getJobTypeColor(job.type)}>
                    {job.type ? job.type.replace('-', ' ').toUpperCase() : 'FULL TIME'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-cmo-text-secondary">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location || 'Location not specified'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.experience || 'Not specified'}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {job.numberOfVacancies || 1} position{(job.numberOfVacancies || 1) > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Posted {formatDate(job.postedAt)}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cmo-text-secondary whitespace-pre-line">
                  {job.description || 'No description available'}
                </p>
              </CardContent>
            </Card>

            {/* Skills & Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-cmo-text-primary mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills && Array.isArray(job.skills) && job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-cmo-text-primary mb-2">Qualifications</h4>
                  <p className="text-cmo-text-secondary">{job.qualifications}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            {job.alreadyApplied && job.applicationStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getApplicationStatusColor(job.applicationStatus)}>
                    {job.applicationStatus.toUpperCase()}
                  </Badge>
                  {job.applicationId && (
                    <p className="text-sm text-cmo-text-secondary mt-2">
                      Application ID: {job.applicationId}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Apply Button */}
            {!job.isOwner && (
              <Card>
                <CardContent className="pt-6">
                  {job.alreadyApplied ? (
                    <Button disabled className="w-full">
                      Already Applied
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleApplyJob}
                      disabled={applying}
                      className="w-full"
                      data-testid="button-apply-job"
                    >
                      {applying ? 'Applying...' : 'Apply Now'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Job Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-cmo-text-secondary">
                    <Eye className="w-4 h-4 mr-2" />
                    Total Views
                  </div>
                  <span className="font-semibold">{job.totalViews || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-cmo-text-secondary">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Applications
                  </div>
                  <span className="font-semibold">{job.totalApplications || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cmo-text-secondary">Salary Range</span>
                  <span className="font-semibold">{job.salaryRange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cmo-text-secondary">Industry</span>
                  <span className="font-semibold">{job.industry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cmo-text-secondary">Application Deadline</span>
                  <span className="font-semibold">{formatDate(job.deadline)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
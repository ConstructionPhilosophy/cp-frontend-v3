import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Users, Calendar, TrendingUp, MapPin, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import Header from "../components/layout/header";
import SidebarRight from "../components/layout/sidebar-right";
import MobileNavigation from "../components/mobile-navigation";
import { useIsMobile } from "../hooks/use-mobile";

interface JobSummary {
  jobId: string;
  title: string;
  totalViews: number;
  totalApplications: number;
}

interface JobAnalytics {
  jobId: string;
  totalViews: number;
  totalApplications: number;
  viewTimeline: Record<string, number>;
  applicationTimeline: Record<string, number>;
  uniqueViewers: Record<string, boolean>;
  lastViewedAt: string;
  lastAppliedAt: string;
}

interface JobDetails {
  jobId: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  experience: string;
  qualifications: string[];
  skills: string[];
  postedDate: string;
  status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cp-backend-service-test-972540571952.asia-south1.run.app';

export default function EmployerDashboard() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Fetch job analytics summary
  const { data: jobSummaries, isLoading: isLoadingSummary } = useQuery<JobSummary[]>({
    queryKey: ['/employer/job-analytics-summary'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/employer/job-analytics-summary`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebase-token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch job analytics summary');
      }
      return response.json();
    },
  });

  // Fetch detailed job analytics for selected job
  const { data: jobAnalytics, isLoading: isLoadingAnalytics } = useQuery<JobAnalytics>({
    queryKey: ['/employer/job-analytics', selectedJobId],
    queryFn: async () => {
      if (!selectedJobId) return null;
      const response = await fetch(`${API_BASE_URL}/employer/job-analytics?jobId=${selectedJobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebase-token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch job analytics');
      }
      return response.json();
    },
    enabled: !!selectedJobId,
  });

  // Fetch job details for selected job
  const { data: jobDetails, isLoading: isLoadingDetails } = useQuery<JobDetails>({
    queryKey: ['/job', selectedJobId],
    queryFn: async () => {
      if (!selectedJobId) return null;
      const response = await fetch(`${API_BASE_URL}/job?id=${selectedJobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebase-token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      return response.json();
    },
    enabled: !!selectedJobId,
  });

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  return (
    <div className="min-h-screen bg-cmo-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600">View and analyze your job postings performance</p>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Job List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Job Postings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingSummary ? (
                    <div className="space-y-3 p-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {jobSummaries?.map((job: JobSummary) => (
                        <div
                          key={job.jobId}
                          className={`p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                            selectedJobId === job.jobId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => handleJobSelect(job.jobId)}
                          data-testid={`job-item-${job.jobId}`}
                        >
                          <h3 className="font-medium text-gray-900 text-sm">{job.title}</h3>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {job.totalViews}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {job.totalApplications}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Job Details and Analytics */}
            <div className="lg:col-span-2">
              {!selectedJobId ? (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Select a job to view details and analytics</p>
                  </div>
                </Card>
              ) : (
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {isLoadingDetails ? (
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="flex gap-2">
                              <Skeleton className="h-6 w-16" />
                              <Skeleton className="h-6 w-16" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : jobDetails ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">{jobDetails.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {jobDetails.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {jobDetails.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {jobDetails.experience}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{jobDetails.description}</p>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">Qualifications</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {jobDetails.qualifications?.map((qualification: string, index: number) => (
                                <li key={index}>{qualification}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {jobDetails.skills?.map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-gray-600">
                              Posted: {jobDetails.postedDate ? format(new Date(jobDetails.postedDate), 'MMM dd, yyyy') : 'Unknown'}
                            </div>
                            <Badge variant={jobDetails.status === 'active' ? 'default' : 'secondary'}>
                              {jobDetails.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ) : null}
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4">
                    {isLoadingAnalytics ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <Card key={i}>
                            <CardContent className="p-6">
                              <Skeleton className="h-4 w-1/2 mb-2" />
                              <Skeleton className="h-8 w-1/3" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : jobAnalytics ? (
                      <>
                        {/* Analytics Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">Total Views</p>
                                  <p className="text-2xl font-bold text-gray-900">{jobAnalytics.totalViews}</p>
                                </div>
                                <Eye className="h-8 w-8 text-blue-500" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">Total Applications</p>
                                  <p className="text-2xl font-bold text-gray-900">{jobAnalytics.totalApplications}</p>
                                </div>
                                <Users className="h-8 w-8 text-green-500" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">Unique Viewers</p>
                                  <p className="text-2xl font-bold text-gray-900">{Object.keys(jobAnalytics.uniqueViewers).length}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-500" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">Conversion Rate</p>
                                  <p className="text-2xl font-bold text-gray-900">
                                    {jobAnalytics.totalViews > 0 
                                      ? Math.round((jobAnalytics.totalApplications / jobAnalytics.totalViews) * 100) 
                                      : 0}%
                                  </p>
                                </div>
                                <Calendar className="h-8 w-8 text-orange-500" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Timeline Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">View Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {Object.entries(jobAnalytics.viewTimeline).map(([date, views]) => (
                                  <div key={date} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                      {format(new Date(date), 'MMM dd')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="h-2 bg-blue-500 rounded"
                                        style={{ 
                                          width: `${Math.max((Number(views) / Math.max(...Object.values(jobAnalytics.viewTimeline).map(Number))) * 100, 10)}px` 
                                        }}
                                      />
                                      <span className="text-sm font-medium">{String(views)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Application Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {Object.entries(jobAnalytics.applicationTimeline).length > 0 ? (
                                  Object.entries(jobAnalytics.applicationTimeline).map(([date, applications]) => (
                                    <div key={date} className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">
                                        {format(new Date(date), 'MMM dd')}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="h-2 bg-green-500 rounded"
                                          style={{ 
                                            width: `${Math.max((Number(applications) / Math.max(...Object.values(jobAnalytics.applicationTimeline).map(Number))) * 100, 10)}px` 
                                          }}
                                        />
                                        <span className="text-sm font-medium">{String(applications)}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500 text-center py-4">No applications yet</p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Last Activity */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Last Viewed</span>
                                <span className="text-sm font-medium">
                                  {jobAnalytics.lastViewedAt 
                                    ? format(new Date(jobAnalytics.lastViewedAt), 'MMM dd, yyyy HH:mm') 
                                    : 'No views yet'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600">Last Application</span>
                                <span className="text-sm font-medium">
                                  {jobAnalytics.lastAppliedAt 
                                    ? format(new Date(jobAnalytics.lastAppliedAt), 'MMM dd, yyyy HH:mm') 
                                    : 'No applications yet'}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ) : null}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    </div>
  );
}
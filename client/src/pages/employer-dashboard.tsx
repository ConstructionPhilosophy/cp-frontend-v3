import React, { useState } from "react";
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

  // Mock data for development - replace with real API calls
  const [jobSummaries, setJobSummaries] = useState<JobSummary[]>([
    {
      jobId: "abc123",
      title: "Site Engineer",
      totalViews: 34,
      totalApplications: 12
    },
    {
      jobId: "xyz789", 
      title: "Project Manager",
      totalViews: 21,
      totalApplications: 9
    },
    {
      jobId: "def456",
      title: "Civil Engineer",
      totalViews: 45,
      totalApplications: 8
    }
  ]);

  const [jobAnalytics, setJobAnalytics] = useState<JobAnalytics | null>(
    selectedJobId ? {
      jobId: selectedJobId,
      totalViews: 34,
      totalApplications: 12,
      viewTimeline: {
        "2025-08-25": 8,
        "2025-08-26": 5,
        "2025-08-27": 12,
        "2025-08-28": 9
      },
      applicationTimeline: {
        "2025-08-26": 4,
        "2025-08-28": 8
      },
      uniqueViewers: {
        "uid123": true,
        "uid456": true,
        "uid789": true
      },
      lastViewedAt: "2025-08-29T06:00:00Z",
      lastAppliedAt: "2025-08-29T07:30:00Z"
    } : null
  );

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(
    selectedJobId ? {
      jobId: selectedJobId,
      title: "Site Engineer",
      description: "We are looking for an experienced Site Engineer to oversee construction projects and ensure quality standards are met.",
      location: "Mumbai, India",
      salary: "₹8-12 LPA",
      experience: "3-5 years",
      qualifications: [
        "Bachelor's degree in Civil Engineering",
        "3+ years of construction site experience",
        "Knowledge of construction safety protocols"
      ],
      skills: ["AutoCAD", "Project Management", "Quality Control", "Safety Management"],
      postedDate: "2025-08-20T00:00:00Z",
      status: "active"
    } : null
  );

  const isLoadingSummary = false;
  const isLoadingAnalytics = false;
  const isLoadingDetails = false;

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    
    // Update analytics based on selected job
    const mockAnalytics: Record<string, JobAnalytics> = {
      "abc123": {
        jobId: "abc123",
        totalViews: 34,
        totalApplications: 12,
        viewTimeline: {
          "2025-08-25": 8,
          "2025-08-26": 5,
          "2025-08-27": 12,
          "2025-08-28": 9
        },
        applicationTimeline: {
          "2025-08-26": 4,
          "2025-08-28": 8
        },
        uniqueViewers: {
          "uid123": true,
          "uid456": true,
          "uid789": true
        },
        lastViewedAt: "2025-08-29T06:00:00Z",
        lastAppliedAt: "2025-08-29T07:30:00Z"
      },
      "xyz789": {
        jobId: "xyz789",
        totalViews: 21,
        totalApplications: 9,
        viewTimeline: {
          "2025-08-25": 5,
          "2025-08-26": 3,
          "2025-08-27": 8,
          "2025-08-28": 5
        },
        applicationTimeline: {
          "2025-08-27": 3,
          "2025-08-28": 6
        },
        uniqueViewers: {
          "uid111": true,
          "uid222": true
        },
        lastViewedAt: "2025-08-29T05:30:00Z",
        lastAppliedAt: "2025-08-29T08:15:00Z"
      },
      "def456": {
        jobId: "def456",
        totalViews: 45,
        totalApplications: 8,
        viewTimeline: {
          "2025-08-25": 12,
          "2025-08-26": 10,
          "2025-08-27": 15,
          "2025-08-28": 8
        },
        applicationTimeline: {
          "2025-08-26": 2,
          "2025-08-28": 6
        },
        uniqueViewers: {
          "uid333": true,
          "uid444": true,
          "uid555": true,
          "uid666": true
        },
        lastViewedAt: "2025-08-29T04:45:00Z",
        lastAppliedAt: "2025-08-29T09:00:00Z"
      }
    };

    const mockDetails: Record<string, JobDetails> = {
      "abc123": {
        jobId: "abc123",
        title: "Site Engineer",
        description: "We are looking for an experienced Site Engineer to oversee construction projects and ensure quality standards are met.",
        location: "Mumbai, India",
        salary: "₹8-12 LPA",
        experience: "3-5 years",
        qualifications: [
          "Bachelor's degree in Civil Engineering",
          "3+ years of construction site experience",
          "Knowledge of construction safety protocols"
        ],
        skills: ["AutoCAD", "Project Management", "Quality Control", "Safety Management"],
        postedDate: "2025-08-20T00:00:00Z",
        status: "active"
      },
      "xyz789": {
        jobId: "xyz789",
        title: "Project Manager",
        description: "Seeking an experienced Project Manager to lead construction projects from planning to completion.",
        location: "Delhi, India",
        salary: "₹15-20 LPA",
        experience: "5-8 years",
        qualifications: [
          "Bachelor's degree in Civil Engineering or Construction Management",
          "5+ years of project management experience",
          "PMP certification preferred"
        ],
        skills: ["MS Project", "Budget Management", "Team Leadership", "Risk Management"],
        postedDate: "2025-08-18T00:00:00Z",
        status: "active"
      },
      "def456": {
        jobId: "def456",
        title: "Civil Engineer",
        description: "Looking for a skilled Civil Engineer to design and supervise construction of infrastructure projects.",
        location: "Bangalore, India",
        salary: "₹6-10 LPA",
        experience: "2-4 years",
        qualifications: [
          "Bachelor's degree in Civil Engineering",
          "2+ years of design experience",
          "Knowledge of structural analysis software"
        ],
        skills: ["SAP2000", "ETABS", "Structural Design", "Foundation Design"],
        postedDate: "2025-08-22T00:00:00Z",
        status: "active"
      }
    };

    setJobAnalytics(mockAnalytics[jobId] || null);
    setJobDetails(mockDetails[jobId] || null);
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
  );
}
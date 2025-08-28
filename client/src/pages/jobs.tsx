import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Bookmark,
  Plus,
  ToggleLeft,
  ToggleRight,
  Eye,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "../components/layout/header";
import SidebarRight from "../components/layout/sidebar-right";
import MobileNavigation from "../components/mobile-navigation";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import JobApplicationModal from "../components/JobApplicationModal";

interface Job {
  jobId: string;
  title: string;
  company: string;
  postedBy: string;
  description: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "freelance";
  salaryRange: string;
  skills: string[];
  experience: string;
  industry: string;
  postedAt: string;
  deadline: string;
  qualifications: string;
  numberOfVacancies: number;
  // Additional fields for job details
  isOwner?: boolean;
  alreadyApplied?: boolean;
  applicationId?: string;
  applicationStatus?: "applied" | "shortlisted" | "rejected" | "hired";
  totalViews?: number;
  totalApplications?: number;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<Job | null>(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openToWork, setOpenToWork] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch jobs from API
  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://cp-backend-service-test-972540571952.asia-south1.run.app";

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiBaseUrl}/jobs`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }

      const jobsData = await response.json();

      // Transform API response to match our interface
      const transformedJobs = jobsData.map((job: any) => ({
        jobId: job.JobID,
        title: job.Title,
        company: job.Company,
        location: job.Location,
        type: job.Type,
        skills: job.Skills || [],
        experience: job.Experience,
        salaryRange: job.SalaryRange,
        description: job.Description,
        qualifications: job.Qualifications,
        postedAt: job.PostedAt,
        deadline: job.Deadline,
        numberOfVacancies: job.Vacancies || 1,
        industry: job.Industry,
        postedBy: job.PostedBy,
      }));

      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // For now, show empty list if API fails
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search criteria
  useEffect(() => {
    if (!jobs || !Array.isArray(jobs)) {
      setFilteredJobs([]);
      return;
    }

    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          (job.title &&
            job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.skills &&
            Array.isArray(job.skills) &&
            job.skills.some(
              (skill) =>
                skill && skill.toLowerCase().includes(searchTerm.toLowerCase()),
            )) ||
          (job.company &&
            job.company.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(
        (job) =>
          job.location &&
          job.location.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    }

    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((job) => job.type === typeFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, typeFilter]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently posted";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently posted";

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getJobTypeColor = (type?: string) => {
    if (!type) return "bg-green-100 text-green-700 border-green-200"; // Default to full-time styling

    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-700 border-green-200";
      case "part-time":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "contract":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "freelance":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const fetchJobDetails = async (jobId: string) => {
    try {
      setLoadingJobDetails(true);
      const token = await user?.getIdToken();
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://cp-backend-service-test-972540571952.asia-south1.run.app";

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiBaseUrl}/job?id=${jobId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.status}`);
      }

      const jobData = await response.json();

      // Transform API response to match our interface
      const transformedJob = {
        jobId: jobData.JobID,
        title: jobData.Title,
        company: jobData.Company,
        location: jobData.Location,
        type: jobData.Type,
        skills: jobData.Skills || [],
        experience: jobData.Experience,
        salaryRange: jobData.SalaryRange,
        description: jobData.Description,
        qualifications: jobData.Qualifications,
        postedAt: jobData.PostedAt,
        deadline: jobData.Deadline,
        numberOfVacancies: jobData.Vacancies || 1,
        industry: jobData.Industry,
        postedBy: jobData.PostedBy,
        alreadyApplied: jobData.AlreadyApplied || false,
        applicationStatus: jobData.ApplicationStatus,
        applicationId: jobData.ApplicationId,
        isOwner: jobData.IsOwner || false,
        totalViews: jobData.TotalViews || 0,
        totalApplications: jobData.TotalApplications || 0,
      };

      setSelectedJobDetails(transformedJob);
      setSelectedJob(transformedJob);
    } catch (error) {
      console.error("Error fetching job details:", error);
      // For now, just use the basic job data from the list
      const jobFromList = jobs.find(j => j.jobId === jobId);
      if (jobFromList) {
        setSelectedJobDetails(jobFromList);
        setSelectedJob(jobFromList);
      }
    } finally {
      setLoadingJobDetails(false);
    }
  };

  const handleJobClick = async (jobId: string) => {
    console.log('Job clicked:', jobId, 'Should open modal');
    // Set selectedJob first to open modal immediately
    const jobFromList = jobs.find(j => j.jobId === jobId);
    if (jobFromList) {
      setSelectedJob(jobFromList);
    }
    console.log('Fetching job details...');
    await fetchJobDetails(jobId);
    console.log('Job details fetched, modal should be open');
  };

  // Application Modal State
  const [applicationModal, setApplicationModal] = useState<{
    isOpen: boolean;
    jobId: string;
    jobTitle: string;
  }>({
    isOpen: false,
    jobId: "",
    jobTitle: "",
  });

  const handleApplyJob = (jobId: string) => {
    const job = jobs.find(j => j.jobId === jobId);
    setApplicationModal({
      isOpen: true,
      jobId,
      jobTitle: job?.title || "Unknown Job",
    });
  };

  const handleApplicationSubmitted = () => {
    // Refresh jobs list to update application status
    fetchJobs();
  };

  const handleSaveJob = (jobId: string) => {
    // Implement save job logic
    console.log("Save job:", jobId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cmo-primary mx-auto"></div>
            <p className="mt-4 text-cmo-text-secondary">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cmo-bg-main">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-4">
          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="flex gap-6">
              {/* Left Sidebar */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-cmo-border p-4 mb-4">
                  <h2 className="text-lg font-semibold text-cmo-text-primary mb-4">
                    Job Actions
                  </h2>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      variant="default"
                      onClick={() => setLocation("/post-job")}
                      data-testid="button-post-job"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post a Job
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-saved-jobs"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Saved Jobs
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-my-applications"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      My Applications
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-dashboard"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </div>
                </div>

                {/* Open to Work Toggle */}
                <div className="bg-white rounded-lg border border-cmo-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-cmo-text-primary">
                      Open to Work
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpenToWork(!openToWork)}
                      className="p-0 h-6 w-10"
                      data-testid="toggle-open-to-work"
                    >
                      {openToWork ? (
                        <ToggleRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-cmo-text-secondary mt-1">
                    Let recruiters know you're looking for opportunities
                  </p>
                </div>
              </div>

              {/* Main Jobs Content */}
              <div className="flex-1">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg border border-cmo-border p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cmo-text-secondary w-4 h-4" />
                        <Input
                          placeholder="Job title, skills, company..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                          data-testid="input-job-search"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cmo-text-secondary w-4 h-4" />
                        <Input
                          placeholder="Location (e.g. Chennai)"
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="pl-10"
                          data-testid="input-location-filter"
                        />
                      </div>
                    </div>
                    <div>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger data-testid="select-job-type">
                          <SelectValue placeholder="Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Job Results Header */}
                <div className="mb-4">
                  <h1 className="text-xl font-semibold text-cmo-text-primary">
                    {filteredJobs?.length || 0} Job
                    {(filteredJobs?.length || 0) !== 1 ? "s" : ""} Found
                  </h1>
                  <p className="text-sm text-cmo-text-secondary">
                    Showing results for construction industry professionals
                  </p>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                  {filteredJobs && filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <div
                        key={job.jobId}
                        className="bg-white rounded-lg border border-cmo-border p-4 hover:border-cmo-primary transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleJobClick(job.jobId);
                        }}
                        data-testid={`card-job-${job.jobId}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-cmo-text-primary mb-1">
                              {job.title}
                            </h3>
                            <p className="text-cmo-text-secondary font-medium">
                              {job.company}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveJob(job.jobId);
                              }}
                              data-testid={`button-save-${job.jobId}`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-cmo-text-secondary">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location || "Location not specified"}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.experience || "Not specified"}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {job.postedAt
                              ? formatDate(job.postedAt)
                              : "Recently posted"}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={getJobTypeColor(job.type)}
                          >
                            {(job.type || "full-time")
                              .replace("-", " ")
                              .toUpperCase()}
                          </Badge>
                          <span className="text-lg font-semibold text-cmo-primary">
                            {job.salaryRange || "Salary not disclosed"}
                          </span>
                        </div>

                        <p className="text-cmo-text-secondary text-sm mb-3 line-clamp-2">
                          {job.description || "No description available"}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {job.skills &&
                            Array.isArray(job.skills) &&
                            job.skills.slice(0, 4).map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          {job.skills && job.skills.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-cmo-text-secondary">
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {job.totalViews || 0} views
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {job.totalApplications || 0} applications
                            </div>
                          </div>
                          {job.alreadyApplied ? (
                            <Badge
                              variant="outline"
                              className="text-green-700 border-green-200"
                            >
                              Applied
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApplyJob(job.jobId);
                              }}
                              data-testid={`button-apply-${job.jobId}`}
                            >
                              Apply Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="w-16 h-16 text-cmo-text-secondary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-cmo-text-primary mb-2">
                        No Jobs Found
                      </h3>
                      <p className="text-cmo-text-secondary">
                        Try adjusting your search criteria or filters
                      </p>
                    </div>
                  )}
                </div>

                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-cmo-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-cmo-text-secondary">Loading jobs...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="hidden lg:block lg:col-span-3">
              <SidebarRight />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}

      {/* Job Detail Modal */}
      <Dialog open={!!selectedJob} onOpenChange={() => {
        setSelectedJob(null);
        setSelectedJobDetails(null);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {loadingJobDetails ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cmo-primary"></div>
              <p className="ml-4 text-cmo-text-secondary">Loading job details...</p>
            </div>
          ) : selectedJobDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {selectedJobDetails.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-cmo-text-primary">
                      {selectedJobDetails.company}
                    </h3>
                    <div className="flex items-center text-cmo-text-secondary text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedJobDetails.location || 'Location not specified'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-cmo-primary">
                      {selectedJobDetails.salaryRange || 'Salary not disclosed'}
                    </div>
                    <Badge className={getJobTypeColor(selectedJobDetails.type)}>
                      {(selectedJobDetails?.type || "full-time")
                        .replace("-", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-cmo-text-primary mb-2">
                      Experience Required
                    </h4>
                    <p className="text-cmo-text-secondary">
                      {selectedJobDetails.experience || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cmo-text-primary mb-2">
                      Qualifications
                    </h4>
                    <p className="text-cmo-text-secondary">
                      {selectedJobDetails.qualifications || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cmo-text-primary mb-2">
                      Vacancies
                    </h4>
                    <p className="text-cmo-text-secondary">
                      {selectedJobDetails.numberOfVacancies || 1} position
                      {(selectedJobDetails.numberOfVacancies || 1) > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cmo-text-primary mb-2">
                      Application Deadline
                    </h4>
                    <p className="text-cmo-text-secondary">
                      {selectedJobDetails.deadline ? 
                        new Date(selectedJobDetails.deadline).toLocaleDateString("en-IN") : 
                        'Not specified'
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-cmo-text-primary mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(selectedJobDetails.skills || []).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-cmo-text-primary mb-2">
                    Job Description
                  </h4>
                  <p className="text-cmo-text-secondary leading-relaxed">
                    {selectedJobDetails.description || 'No description available'}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex space-x-4 text-sm text-cmo-text-secondary">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedJobDetails.totalViews || 0} views
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {selectedJobDetails.totalApplications || 0} applications
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Posted {formatDate(selectedJobDetails.postedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {selectedJobDetails.alreadyApplied ? (
                    <Button disabled className="flex-1">
                      Already Applied
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => handleApplyJob(selectedJobDetails.jobId)}
                      data-testid="button-apply-modal"
                    >
                      Apply for this Job
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleSaveJob(selectedJobDetails.jobId)}
                    data-testid="button-save-modal"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save Job
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={applicationModal.isOpen}
        onClose={() => setApplicationModal(prev => ({ ...prev, isOpen: false }))}
        jobId={applicationModal.jobId}
        jobTitle={applicationModal.jobTitle}
        onApplicationSubmitted={handleApplicationSubmitted}
      />
    </div>
  );
};

export default JobsPage;

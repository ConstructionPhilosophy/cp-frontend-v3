import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Briefcase, Bookmark, Plus, ToggleLeft, ToggleRight, Eye, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '../components/layout/header';
import SidebarRight from '../components/layout/sidebar-right';
import MobileNavigation from '../components/mobile-navigation';
import { useIsMobile } from '../hooks/use-mobile';

interface Job {
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
  // Additional fields for job details
  isOwner?: boolean;
  alreadyApplied?: boolean;
  applicationId?: string;
  applicationStatus?: 'applied' | 'shortlisted' | 'rejected' | 'hired';
  totalViews?: number;
  totalApplications?: number;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [openToWork, setOpenToWork] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const isMobile = useIsMobile();

  // Sample data - replace with API call
  useEffect(() => {
    const sampleJobs: Job[] = [
      {
        jobId: "abc123def456",
        title: "Senior Civil Engineer",
        company: "BuildSmart Pvt Ltd",
        postedBy: "userUID123",
        description: "We are looking for an experienced civil engineer to lead major construction projects. The ideal candidate will have strong project management skills and expertise in structural design.",
        location: "Chennai",
        type: "full-time",
        salaryRange: "₹8L - ₹12L",
        skills: ["AutoCAD", "Site Management", "Project Management", "Structural Design"],
        experience: "5+ years",
        industry: "Construction",
        postedAt: "2025-01-28T08:00:00Z",
        deadline: "2025-02-28T00:00:00Z",
        qualifications: "B.E/B.Tech in Civil Engineering",
        numberOfVacancies: 2,
        isOwner: false,
        alreadyApplied: false,
        applicationStatus: 'applied',
        totalViews: 14,
        totalApplications: 5
      },
      {
        jobId: "xyz789abc123",
        title: "Construction Project Manager",
        company: "Metro Infrastructure",
        postedBy: "userUID456",
        description: "Leading construction company seeks experienced project manager for high-rise residential projects. Must have expertise in planning, scheduling, and team coordination.",
        location: "Bangalore",
        type: "full-time",
        salaryRange: "₹12L - ₹18L",
        skills: ["Project Management", "MS Project", "Team Leadership", "Budget Management"],
        experience: "7+ years",
        industry: "Construction",
        postedAt: "2025-01-27T10:30:00Z",
        deadline: "2025-03-15T00:00:00Z",
        qualifications: "B.E/B.Tech with PMP certification preferred",
        numberOfVacancies: 1,
        isOwner: false,
        alreadyApplied: true,
        applicationId: "app789xyz321",
        applicationStatus: 'applied',
        totalViews: 28,
        totalApplications: 12
      },
      {
        jobId: "def456ghi789",
        title: "Structural Design Engineer",
        company: "TechBuild Solutions",
        postedBy: "userUID789",
        description: "Join our dynamic team as a structural design engineer. Work on innovative projects including commercial buildings, bridges, and infrastructure development.",
        location: "Chennai",
        type: "full-time",
        salaryRange: "₹6L - ₹10L",
        skills: ["STAAD Pro", "AutoCAD", "Structural Analysis", "Design Codes"],
        experience: "3+ years",
        industry: "Construction",
        postedAt: "2025-01-26T14:15:00Z",
        deadline: "2025-02-20T00:00:00Z",
        qualifications: "B.E/B.Tech in Civil/Structural Engineering",
        numberOfVacancies: 3,
        isOwner: false,
        alreadyApplied: false,
        totalViews: 42,
        totalApplications: 18
      }
    ];
    
    setJobs(sampleJobs);
    setFilteredJobs(sampleJobs);
    setLoading(false);
  }, []);

  // Filter jobs based on search criteria
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, typeFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-700 border-green-200';
      case 'part-time': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contract': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'freelance': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleApplyJob = (jobId: string) => {
    // Implement apply job logic
    console.log('Apply to job:', jobId);
  };

  const handleSaveJob = (jobId: string) => {
    // Implement save job logic
    console.log('Save job:', jobId);
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
                  <h2 className="text-lg font-semibold text-cmo-text-primary mb-4">Job Actions</h2>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="default"
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
                    <span className="text-sm font-medium text-cmo-text-primary">Open to Work</span>
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
                    {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
                  </h1>
                  <p className="text-sm text-cmo-text-secondary">
                    Showing results for construction industry professionals
                  </p>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div 
                      key={job.jobId}
                      className="bg-white rounded-lg border border-cmo-border p-4 hover:border-cmo-primary transition-colors cursor-pointer"
                      onClick={() => setSelectedJob(job)}
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
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.experience}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(job.postedAt)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          variant="outline" 
                          className={getJobTypeColor(job.type)}
                        >
                          {job.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-lg font-semibold text-cmo-primary">
                          {job.salaryRange}
                        </span>
                      </div>

                      <p className="text-cmo-text-secondary text-sm mb-3 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.skills.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-cmo-text-secondary">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {job.totalViews} views
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {job.totalApplications} applications
                          </div>
                        </div>
                        {job.alreadyApplied ? (
                          <Badge variant="outline" className="text-green-700 border-green-200">
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
                  ))}
                </div>

                {filteredJobs.length === 0 && (
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
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {selectedJob.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-cmo-text-primary">
                      {selectedJob.company}
                    </h3>
                    <div className="flex items-center text-cmo-text-secondary text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedJob.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-cmo-primary">
                      {selectedJob.salaryRange}
                    </div>
                    <Badge className={getJobTypeColor(selectedJob.type)}>
                      {selectedJob.type.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-cmo-text-primary mb-2">Experience Required</h4>
                    <p className="text-cmo-text-secondary">{selectedJob.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cmo-text-primary mb-2">Qualifications</h4>
                    <p className="text-cmo-text-secondary">{selectedJob.qualifications}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cmo-text-primary mb-2">Vacancies</h4>
                    <p className="text-cmo-text-secondary">{selectedJob.numberOfVacancies} position{selectedJob.numberOfVacancies > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cmo-text-primary mb-2">Application Deadline</h4>
                    <p className="text-cmo-text-secondary">
                      {new Date(selectedJob.deadline).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-cmo-text-primary mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-cmo-text-primary mb-2">Job Description</h4>
                  <p className="text-cmo-text-secondary leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex space-x-4 text-sm text-cmo-text-secondary">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedJob.totalViews} views
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {selectedJob.totalApplications} applications
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Posted {formatDate(selectedJob.postedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {selectedJob.alreadyApplied ? (
                    <Button disabled className="flex-1">
                      Already Applied
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1"
                      onClick={() => handleApplyJob(selectedJob.jobId)}
                      data-testid="button-apply-modal"
                    >
                      Apply for this Job
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleSaveJob(selectedJob.jobId)}
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
    </div>
  );
};

export default JobsPage;
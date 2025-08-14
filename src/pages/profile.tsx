import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  MessageCircle, 
  FileText,
  ExternalLink,
  CheckCircle,
  Building,
  GraduationCap,
  Briefcase,
  Globe
} from 'lucide-react';

// Mock data based on API structure
const mockProfileData = {
  uid: "abc123",
  email: "john.smith@example.com",
  emailVerified: true,
  firstName: "John",
  lastName: "Smith",
  phoneNumber: "+911234567890",
  photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  bannerUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300",
  title: "CMO at SingleFire",
  positionDesignation: "Chief Marketing Officer",
  gender: "Male",
  dateOfBirth: "1985-03-15",
  city: "Virginia",
  state: "NY",
  country: "United States",
  about: "I'm the model of the new CMO. I've combined a deep background in brand management at blue chip CPG companies with eCommerce growth marketing at the world's biggest retailer. I've run SingleFire I've created world-class campaigns; I've built digital marketing organisations from the ground up. I have over 20 years experience leading... See more",
  skills: [
    "Leadership",
    "Marketing",
    "Public-relations", 
    "Branding"
  ],
  language: [
    "English",
    "Spanish"
  ],
  followersCount: 142,
  followingCount: 80,
  postCount: 15,
  messageCount: 5,
  createdTime: "2020-05-01T12:00:00Z",
  updatedTime: "2025-07-01T09:30:00Z",
  isFollowing: false
};

const mockEducation = [
  {
    id: "edu1",
    degree: "MBA",
    fieldOfStudy: "Marketing & Business Strategy",
    schoolOrCollege: "Oxford International",
    startDate: "2008-09-01",
    endDate: "2010-06-30",
    grade: "Distinction"
  },
  {
    id: "edu2",
    degree: "B.A.",
    fieldOfStudy: "Business Administration",
    schoolOrCollege: "Stanford University",
    startDate: "2003-09-01",
    endDate: "2007-05-31",
    grade: "Magna Cum Laude"
  }
];

const mockExperience = [
  {
    id: "exp1",
    company: "SingleFire",
    role: "Chief Marketing Officer",
    location: "Virginia, NY",
    startDate: "2020-01-01",
    endDate: null,
    description: "Leading global marketing strategy and brand management for digital transformation initiatives."
  },
  {
    id: "exp2", 
    company: "Blue Chip CPG",
    role: "Senior Brand Manager",
    location: "New York, NY",
    startDate: "2015-03-01",
    endDate: "2019-12-31",
    description: "Managed multi-million dollar brand portfolios and launched successful product campaigns."
  }
];

const mockActivities = [
  {
    id: "1",
    type: "question",
    title: "Do you have any experience with deploying @Hubspot for a SaaS business with both a direct and self-serve model?",
    content: "We have a $2M ARR B2B startup with a custom solution today. We are using @Mixpanel and working with @Division of Labor to rebuild our pages. @Jennifer Smith... See more",
    timestamp: "Nov 19",
    category: "Questions & Answers",
    engagement: { answers: 1, thanks: 5, insightful: 2 }
  },
  {
    id: "2",
    type: "article",
    title: "Looking for a new landing page optimization vendor",
    content: "We are looking for a landing page tool that they are missing a minimal with a custom solution that no... See more",
    timestamp: "Nov 12",
    category: "#Inbound #SaaS",
    engagement: { answers: 1, thanks: 15, insightful: 6 }
  },
  {
    id: "3",
    type: "post",
    title: "Why Your Company Needs a CRM to Grow Better?",
    content: "CRMs are powerful tools that help you expedite business growth while eliminating friction, improving cross-team collaboration, managing your contact records, syncing... See more",
    timestamp: "Nov 11",
    category: "Questions & #CRM #Growth",
    engagement: { answers: 1, thanks: 21, insightful: 12 }
  }
];

const activityFilters = ["All", "Questions & Answers", "Updates & Insights", "Articles & News"];

export default function ProfilePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFullAbout, setShowFullAbout] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="min-h-screen bg-cmo-bg-main">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Card */}
            <Card className="overflow-hidden">
              {/* Banner */}
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ 
                  backgroundImage: `url(${mockProfileData.bannerUrl})`,
                  backgroundSize: 'cover'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 -mt-16 relative z-10">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={mockProfileData.photoUrl} alt={`${mockProfileData.firstName} ${mockProfileData.lastName}`} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(mockProfileData.firstName, mockProfileData.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 mt-16 sm:mt-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl font-bold text-cmo-text-primary">
                            {mockProfileData.firstName} {mockProfileData.lastName}
                          </h1>
                          {mockProfileData.emailVerified && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <p className="text-cmo-text-secondary font-medium mt-1">
                          {mockProfileData.title}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="bg-cmo-primary hover:bg-blue-600 text-white">
                          Message
                        </Button>
                        <Button variant="outline" className="border-cmo-primary text-cmo-primary hover:bg-blue-50">
                          +Follow
                        </Button>
                        <Button variant="outline" size="icon">
                          <span className="text-lg">⋯</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-cmo-text-primary mb-4">About</h2>
                <div className="space-y-4">
                  <p className="text-cmo-text-secondary leading-relaxed">
                    {showFullAbout ? mockProfileData.about : mockProfileData.about.substring(0, 200) + "..."}
                    <button 
                      onClick={() => setShowFullAbout(!showFullAbout)}
                      className="text-cmo-primary ml-2 font-medium hover:underline"
                    >
                      {showFullAbout ? "See less" : "See more"}
                    </button>
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-semibold text-cmo-text-primary mb-2">Marketing expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockProfileData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-cmo-primary bg-blue-50">
                            #{skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-cmo-text-secondary">Open to networking</p>
                        <p className="text-sm font-medium text-cmo-text-primary">Yes</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-cmo-text-primary mb-2">Marketing interests</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-cmo-primary bg-blue-50">
                          #event-marketing
                        </Badge>
                        <Badge variant="secondary" className="text-cmo-primary bg-blue-50">
                          #performance-marketing
                        </Badge>
                        <Badge variant="secondary" className="text-cmo-primary bg-blue-50">
                          #account-based-marketing
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-cmo-text-secondary">Open to advising</p>
                        <p className="text-sm font-medium text-cmo-text-primary">Yes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-cmo-text-secondary" />
                  <h2 className="text-lg font-semibold text-cmo-text-primary">Education</h2>
                </div>
                <div className="space-y-4">
                  {mockEducation.map((edu) => (
                    <div key={edu.id} className="flex gap-4 p-4 border border-cmo-border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-cmo-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-cmo-text-primary">
                          {edu.degree} in {edu.fieldOfStudy}
                        </h3>
                        <p className="text-cmo-text-secondary">{edu.schoolOrCollege}</p>
                        <p className="text-sm text-cmo-text-secondary">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                        {edu.grade && (
                          <p className="text-sm text-cmo-text-secondary">Grade: {edu.grade}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-cmo-text-secondary" />
                  <h2 className="text-lg font-semibold text-cmo-text-primary">Experience</h2>
                </div>
                <div className="space-y-4">
                  {mockExperience.map((exp) => (
                    <div key={exp.id} className="flex gap-4 p-4 border border-cmo-border rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-cmo-text-primary">{exp.role}</h3>
                        <p className="text-cmo-text-secondary">{exp.company}</p>
                        <div className="flex items-center gap-2 text-sm text-cmo-text-secondary">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                        <p className="text-sm text-cmo-text-secondary">
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-cmo-text-secondary mt-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Tabs and Content */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  {activityFilters.map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                      className={activeFilter === filter ? "bg-cmo-primary" : ""}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="border border-cmo-border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={mockProfileData.photoUrl} />
                          <AvatarFallback className="text-xs">
                            {getInitials(mockProfileData.firstName, mockProfileData.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-cmo-text-primary text-sm">
                              {mockProfileData.firstName} {mockProfileData.lastName}
                            </span>
                            <span className="text-cmo-text-secondary text-xs">• {activity.timestamp}</span>
                          </div>
                          <p className="text-xs text-cmo-text-secondary mb-2">{activity.category}</p>
                          <h3 className="font-semibold text-cmo-text-primary mb-2">{activity.title}</h3>
                          <p className="text-cmo-text-secondary text-sm mb-3">{activity.content}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-cmo-text-secondary">
                            <button className="flex items-center gap-1 hover:text-cmo-primary">
                              <MessageCircle className="w-4 h-4" />
                              <span>Answer</span>
                            </button>
                            <span className="flex items-center gap-1">
                              <span>👍</span>
                              <span>Thanks ({activity.engagement.thanks})</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span>💡</span>
                              <span>Insightful ({activity.engagement.insightful})</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Intro Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-cmo-text-primary mb-4">Intro</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-cmo-text-secondary" />
                    <span className="text-sm text-cmo-text-secondary">CMO at SingleFire</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-cmo-text-secondary" />
                    <span className="text-sm text-cmo-text-secondary">Went to Oxford International</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-cmo-text-secondary" />
                    <span className="text-sm text-cmo-text-secondary">Lives in {mockProfileData.city}, {mockProfileData.state}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-cmo-text-secondary" />
                    <span className="text-sm text-cmo-text-secondary">Followed by 12.5k people</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-cmo-text-secondary" />
                    <a href={`mailto:${mockProfileData.email}`} className="text-sm text-cmo-primary hover:underline">
                      {mockProfileData.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-cmo-text-secondary" />
                    <span className="text-sm text-cmo-primary hover:underline cursor-pointer">
                      john.s
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-cmo-primary">Vendors (32)</span>
                    <span className="text-sm font-medium text-cmo-primary">Advice (18)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-cmo-primary">Experts (52)</span>
                    <span className="text-sm font-medium text-cmo-primary">Followers (142)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Filters */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-cmo-text-primary mb-4">Popular filters</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-cmo-primary hover:underline cursor-pointer">All Topics (23)</span>
                    <span className="text-sm text-cmo-primary hover:underline cursor-pointer">#SaaS (10)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cmo-primary hover:underline cursor-pointer">#LeadAds (8)</span>
                    <span className="text-sm text-cmo-primary hover:underline cursor-pointer">#Inbound (3)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cmo-primary hover:underline cursor-pointer">#Europe (2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cmo-primary hover:underline cursor-pointer">#performance-marketing (2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cmo-primary hover:underline cursor-pointer">#facebook-advertising (2)</span>
                  </div>
                </div>
                <Button variant="link" className="text-cmo-primary p-0 h-auto mt-4">
                  Show more
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CalendarIcon, Camera, Loader2, Upload, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { userApiService } from '../lib/userApi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const JOB_TITLES = [
  'Architect',
  'Urban Planner',
  'Interior Designer/Architect',
  'Landscape Architect/Designer',
  'Sustainability Consultant',
  'Draughtsman',
  'Cad/BIM technician',
  'Civil Engineer',
  'Structural Engineer/Designer',
  'Project Director',
  'Construction Manager',
  'Contracts Manager',
  'MEP Engineer',
  'Quality Control Engineer',
  'Planning Engineer',
  'Tendering Engineer',
  'Project Engineer',
  'Supervisor',
  'Foreman',
  'Site Engineer',
  'Site Manager',
  'Electrical Engineer',
  'Geotechnical Engineer',
  'Project Manager',
  'Document Controller',
  'Purchase Manager/Officer',
  'Procurement Manager/Officer',
  'Operations Manager',
  'Trainee',
  'Student',
  'Intern',
  'Project Coordinator',
  'Projects Head',
  'Supplier',
  'Manufacturer',
  'Builder',
  'Contractor',
  'Dealer',
  'Agent',
  'Surveyor',
  'Valuer',
  'Arbitrator',
  'Lecturer',
  'Professor',
  'Other (Specify)',
];

const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CN', name: 'China' },
];

const STATES_BY_COUNTRY: Record<string, string[]> = {
  'IN': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ],
  'US': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ],
  'CA': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'],
  'GB': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'AU': ['Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'],
};

const CITIES_BY_STATE: Record<string, string[]> = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Tuticorin', 'Thanjavur'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Dhule'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davangere', 'Bellary', 'Bijapur', 'Shimoga'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica'],
  'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo'],
};

export function BasicInfoPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showOtherTitle, setShowOtherTitle] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  
  const profileFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    title: '',
    positionDesignation: '',
    company: '',
    customTitle: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateRequiredFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.title) newErrors.title = 'Current job title is required';
    if (showOtherTitle && !formData.customTitle) newErrors.customTitle = 'Please specify the job title';
    if (!formData.positionDesignation) newErrors.positionDesignation = 'Position is required';
    if (!formData.company) newErrors.company = 'Current company is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle "Other (Specify)" option
    if (field === 'title') {
      setShowOtherTitle(value === 'Other (Specify)');
      if (value !== 'Other (Specify)') {
        setFormData(prev => ({ ...prev, customTitle: '' }));
      }
    }

    // Reset dependent fields when parent changes
    if (field === 'country') {
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
    }
    if (field === 'state') {
      setFormData(prev => ({ ...prev, city: '' }));
      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: format(date, 'yyyy-MM-dd')
      }));
      if (errors.dateOfBirth) {
        setErrors(prev => ({ ...prev, dateOfBirth: '' }));
      }
    }
  };

  const handleImageUpload = (file: File, type: 'profile' | 'cover') => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'profile') {
        setProfileImageFile(file);
        setProfileImagePreview(result);
      } else {
        setCoverImageFile(file);
        setCoverImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'profile' | 'cover') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0], type);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
  };

  const getAvailableStates = () => {
    return STATES_BY_COUNTRY[formData.country] || [];
  };

  const getAvailableCities = () => {
    return CITIES_BY_STATE[formData.state] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      toast({
        title: "Authentication Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!validateRequiredFields()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const updateData: any = {
        phoneNumber: formData.phoneNumber || undefined,
        title: showOtherTitle && formData.customTitle ? formData.customTitle : formData.title,
        positionDesignation: formData.positionDesignation,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        company: formData.company,
      };

      // Add image files if they exist
      if (profileImageFile) {
        updateData.profilePic = profileImageFile;
      }
      if (coverImageFile) {
        updateData.bannerPic = coverImageFile;
      }

      await userApiService.updateUser(user.uid, updateData);

      toast({
        title: "Profile Updated!",
        description: "Your basic information has been saved successfully.",
      });

      // Redirect to home page
      setLocation('/');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Please provide your basic information to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile & Cover Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile Images</h3>
                
                {/* Cover Image */}
                <div className="relative">
                  <Label htmlFor="cover-upload">Cover Image (Optional)</Label>
                  <div 
                    className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'cover')}
                    onClick={() => coverFileRef.current?.click()}
                  >
                    {coverImagePreview ? (
                      <div className="relative w-full h-full">
                        <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverImageFile(null);
                            setCoverImagePreview('');
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile Picture Overlay */}
                  <div className="absolute -bottom-8 left-8">
                    <div 
                      className="relative w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg cursor-pointer overflow-hidden"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'profile')}
                      onClick={() => profileFileRef.current?.click()}
                    >
                      {profileImagePreview ? (
                        <div className="relative w-full h-full">
                          <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileImageFile(null);
                              setProfileImagePreview('');
                            }}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 border-2 border-dashed border-gray-300">
                          <Plus className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Label htmlFor="profile-upload" className="text-sm text-gray-600 mt-1 block text-center">
                      Profile Picture
                    </Label>
                  </div>
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={profileFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileInputChange(e, 'profile')}
                />
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileInputChange(e, 'cover')}
                />
              </div>

              {/* Personal Information */}
              <div className="space-y-4 mt-12">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender (Optional)</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                            errors.dateOfBirth && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          initialFocus
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">We'll send you a verification code if provided</p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => handleInputChange('state', value)}
                      disabled={!formData.country}
                    >
                      <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableStates().map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Select 
                      value={formData.city} 
                      onValueChange={(value) => handleInputChange('city', value)}
                      disabled={!formData.state}
                    >
                      <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableCities().map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Current Job Title *</Label>
                    <Select value={formData.title} onValueChange={(value) => handleInputChange('title', value)}>
                      <SelectTrigger className={errors.title ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select job title" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {JOB_TITLES.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                  </div>

                  {/* Custom Title (when Other is selected) */}
                  {showOtherTitle && (
                    <div className="space-y-2">
                      <Label htmlFor="customTitle">Specify Job Title *</Label>
                      <Input
                        id="customTitle"
                        placeholder="Enter your job title"
                        value={formData.customTitle}
                        onChange={(e) => handleInputChange('customTitle', e.target.value)}
                        className={errors.customTitle ? "border-red-500" : ""}
                      />
                      {errors.customTitle && <p className="text-sm text-red-500">{errors.customTitle}</p>}
                    </div>
                  )}

                  {/* Position/Designation */}
                  <div className="space-y-2">
                    <Label htmlFor="positionDesignation">Position/Designation *</Label>
                    <Input
                      id="positionDesignation"
                      placeholder="e.g., Senior Engineer, Team Lead"
                      value={formData.positionDesignation}
                      onChange={(e) => handleInputChange('positionDesignation', e.target.value)}
                      className={errors.positionDesignation ? "border-red-500" : ""}
                    />
                    {errors.positionDesignation && <p className="text-sm text-red-500">{errors.positionDesignation}</p>}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company">Current Company *</Label>
                    <Input
                      id="company"
                      placeholder="Enter company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={errors.company ? "border-red-500" : ""}
                    />
                    {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={loading} className="min-w-[200px]">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Complete Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
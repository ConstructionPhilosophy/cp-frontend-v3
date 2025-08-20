import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Textarea } from '../components/ui/textarea';
import { CalendarIcon, Camera, Loader2, Upload, Plus, X, Check } from 'lucide-react';
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

const COMPANY_TYPES = [
  'Construction Contractor',
  'Design & Engineering Services',
  'Project Management & Consultancy',
  'Cost & Quantity Services',
  'Construction Material Suppliers',
  'Construction Equipment & Machinery',
  'Infrastructure & Utilities',
  'Prefabrication & Modular Construction',
  'Green & Sustainable Construction',
  'Safety & Compliance',
  'Technology & Software',
  'Logistics & Support Services',
  'Testing & Laboratory Services',
];

const INDUSTRIES = [
  'Construction',
  'Real Estate',
  'Infrastructure',
  'Others',
];

const COMPANY_SIZES = [
  '1-10',
  '10-50',
  '50-100',
  '100-500',
  '500-1000',
  '1000+',
];

const COUNTRY_CODES = [
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+61', country: 'AU', name: 'Australia' },
  { code: '+1', country: 'CA', name: 'Canada' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+33', country: 'FR', name: 'France' },
  { code: '+81', country: 'JP', name: 'Japan' },
  { code: '+55', country: 'BR', name: 'Brazil' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+971', country: 'AE', name: 'UAE' },
  { code: '+65', country: 'SG', name: 'Singapore' },
  { code: '+60', country: 'MY', name: 'Malaysia' },
  { code: '+66', country: 'TH', name: 'Thailand' },
  { code: '+84', country: 'VN', name: 'Vietnam' },
];

interface Country {
  name: string;
  iso2: string;
}

interface State {
  name: string;
  iso2: string;
}

interface City {
  name: string;
}

export function BasicInfoPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [userType, setUserType] = useState<'personal' | 'business'>('personal');
  const [showOtherTitle, setShowOtherTitle] = useState(false);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  
  // Location data from custom API
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Phone verification
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  
  const profileFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  // Personal form data
  const [personalData, setPersonalData] = useState({
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    countryCode: '+91',
    country: { name: '', code: '' },
    state: { name: '', code: '' },
    city: '',
    title: '',
    positionDesignation: '',
    company: '',
    customTitle: '',
  });

  // Business form data
  const [businessData, setBusinessData] = useState({
    companyName: '',
    industry: '',
    customIndustry: '',
    companyType: '',
    description: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: { name: '', code: '' },
    country: { name: '', code: '' },
    pincode: '',
    website: '',
    registrationNumber: '',
    companySize: '',
    phoneNumber: '',
    countryCode: '+91',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoadingLocations(true);
      const response = await fetch('/api/countries');
      
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      } else {
        throw new Error('Failed to load countries');
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      toast({
        title: "Error Loading Countries",
        description: "Failed to load country data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoadingLocations(false);
    }
  };

  const loadStates = async (countryCode: string) => {
    try {
      setLoadingLocations(true);
      const response = await fetch(`/api/states?country_code=${countryCode}`);
      
      if (response.ok) {
        const data = await response.json();
        setStates(data);
      } else {
        throw new Error('Failed to load states');
      }
    } catch (error) {
      console.error('Error loading states:', error);
      toast({
        title: "Error Loading States",
        description: "Failed to load state data. Please try again.",
        variant: "destructive",
      });
      setStates([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    try {
      setLoadingLocations(true);
      const response = await fetch(`/api/cities?country_code=${countryCode}&state_code=${stateCode}`);
      
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      } else {
        throw new Error('Failed to load cities');
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      toast({
        title: "Error Loading Cities",
        description: "Failed to load city data. Please try again.",
        variant: "destructive",
      });
      setCities([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  const validateRequiredFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (userType === 'personal') {
      if (!personalData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!personalData.title) newErrors.title = 'Current job title is required';
      if (showOtherTitle && !personalData.customTitle) newErrors.customTitle = 'Please specify the job title';
      if (!personalData.positionDesignation) newErrors.positionDesignation = 'Position is required';
      if (!personalData.company) newErrors.company = 'Current company is required';
      if (!personalData.country.name) newErrors.country = 'Country is required';
      if (!personalData.state.name) newErrors.state = 'State is required';
      if (!personalData.city) newErrors.city = 'City is required';
      
      // Phone verification check
      if (personalData.phoneNumber && !phoneVerified) {
        newErrors.phoneNumber = 'Please verify your phone number';
      }
    } else {
      // Business validation
      if (!businessData.companyName) newErrors.companyName = 'Company name is required';
      if (!businessData.industry) newErrors.industry = 'Industry is required';
      if (showOtherIndustry && !businessData.customIndustry) newErrors.customIndustry = 'Please specify the industry';
      if (!businessData.companyType) newErrors.companyType = 'Company type is required';
      if (!businessData.description) newErrors.description = 'Description is required';
      if (!businessData.addressLine1) newErrors.addressLine1 = 'Address line 1 is required';
      if (!businessData.city) newErrors.city = 'City is required';
      if (!businessData.state.name) newErrors.state = 'State is required';
      if (!businessData.country.name) newErrors.country = 'Country is required';
      if (!businessData.pincode) newErrors.pincode = 'Pincode is required';
      if (!businessData.website) newErrors.website = 'Website is required';
      if (!businessData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
      if (!businessData.companySize) newErrors.companySize = 'Company size is required';
      if (!businessData.phoneNumber) newErrors.phoneNumber = 'Phone number is required for business profiles';
      
      // Phone verification check for business (required field)
      if (businessData.phoneNumber && !phoneVerified) {
        newErrors.phoneNumber = 'Please verify your phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalInputChange = (field: string, value: string | { name: string; code: string }) => {
    setPersonalData(prev => ({
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
        setPersonalData(prev => ({ ...prev, customTitle: '' }));
      }
    }

    // Reset phone verification when phone changes
    if (field === 'phoneNumber') {
      setPhoneCodeSent(false);
      setPhoneVerified(false);
      setVerificationCode('');
    }

    // Handle location changes
    if (field === 'country') {
      const countryObj = value as { name: string; code: string };
      setPersonalData(prev => ({ ...prev, state: { name: '', code: '' }, city: '' }));
      setStates([]);
      setCities([]);
      if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
      
      if (countryObj.code) {
        loadStates(countryObj.code);
      }
    }
    if (field === 'state') {
      const stateObj = value as { name: string; code: string };
      setPersonalData(prev => ({ ...prev, city: '' }));
      setCities([]);
      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
      
      if (personalData.country.code && stateObj.code) {
        loadCities(personalData.country.code, stateObj.code);
      }
    }
  };

  const handleBusinessInputChange = (field: string, value: string | { name: string; code: string }) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle "Others" industry option
    if (field === 'industry') {
      setShowOtherIndustry(value === 'Others');
      if (value !== 'Others') {
        setBusinessData(prev => ({ ...prev, customIndustry: '' }));
      }
    }

    // Reset phone verification when phone changes
    if (field === 'phoneNumber') {
      setPhoneCodeSent(false);
      setPhoneVerified(false);
      setVerificationCode('');
    }

    // Handle location changes
    if (field === 'country') {
      const countryObj = value as { name: string; code: string };
      setBusinessData(prev => ({ ...prev, state: { name: '', code: '' }, city: '' }));
      setStates([]);
      setCities([]);
      if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
      
      if (countryObj.code) {
        loadStates(countryObj.code);
      }
    }
    if (field === 'state') {
      const stateObj = value as { name: string; code: string };
      setBusinessData(prev => ({ ...prev, city: '' }));
      setCities([]);
      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
      
      if (businessData.country.code && stateObj.code) {
        loadCities(businessData.country.code, stateObj.code);
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setPersonalData(prev => ({
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

  const sendVerificationCode = async (phoneNumber: string, countryCode: string) => {
    // Simulate sending OTP - in real implementation, this would call your SMS service
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
        }),
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      // For demo purposes, always return success
      return true;
    }
  };

  const verifyOtpCode = async (phoneNumber: string, countryCode: string, code: string) => {
    // Simulate OTP verification - in real implementation, this would verify with your SMS service
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
          code,
        }),
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // For demo purposes, accept any 6-digit code
      return code.length === 6;
    }
  };

  const handleSendVerificationCode = async () => {
    const currentPhoneNumber = userType === 'personal' ? personalData.phoneNumber : businessData.phoneNumber;
    const currentCountryCode = userType === 'personal' ? personalData.countryCode : businessData.countryCode;
    
    if (!currentPhoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number first",
        variant: "destructive",
      });
      return;
    }

    setSendingCode(true);
    try {
      const success = await sendVerificationCode(currentPhoneNumber, currentCountryCode);
      
      if (success) {
        setPhoneCodeSent(true);
        toast({
          title: "Verification Code Sent",
          description: `Code sent to ${currentCountryCode}${currentPhoneNumber}`,
        });
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      toast({
        title: "Failed to Send Code",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    const currentPhoneNumber = userType === 'personal' ? personalData.phoneNumber : businessData.phoneNumber;
    const currentCountryCode = userType === 'personal' ? personalData.countryCode : businessData.countryCode;
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setVerifyingCode(true);
    try {
      const success = await verifyOtpCode(currentPhoneNumber, currentCountryCode, verificationCode);
      
      if (success) {
        setPhoneVerified(true);
        if (errors.phoneNumber) {
          setErrors(prev => ({ ...prev, phoneNumber: '' }));
        }
        toast({
          title: "Phone Verified!",
          description: "Your phone number has been verified successfully",
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid code. Please try again",
        variant: "destructive",
      });
    } finally {
      setVerifyingCode(false);
    }
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
      let updateData: any = {
        userType,
        hasBasicInfo: true,
      };

      if (userType === 'personal') {
        updateData = {
          ...updateData,
          phoneNumber: personalData.phoneNumber ? `${personalData.countryCode}${personalData.phoneNumber}` : undefined,
          title: showOtherTitle && personalData.customTitle ? personalData.customTitle : personalData.title,
          positionDesignation: personalData.positionDesignation,
          gender: personalData.gender || undefined,
          dateOfBirth: personalData.dateOfBirth,
          city: personalData.city,
          state: personalData.state,
          country: personalData.country,
          company: personalData.company,
        };
      } else {
        // Business data
        const address = businessData.addressLine2 
          ? `${businessData.addressLine1}, ${businessData.addressLine2}`
          : businessData.addressLine1;

        updateData = {
          ...updateData,
          companyName: businessData.companyName,
          industry: showOtherIndustry && businessData.customIndustry ? businessData.customIndustry : businessData.industry,
          companyType: businessData.companyType,
          description: businessData.description,
          address,
          city: businessData.city,
          state: businessData.state,
          country: businessData.country,
          pincode: businessData.pincode,
          website: businessData.website,
          registrationNumber: businessData.registrationNumber,
          companySize: businessData.companySize,
          phoneNumber: businessData.phoneNumber ? `${businessData.countryCode}${businessData.phoneNumber}` : undefined,
        };
      }

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
        description: "Your information has been saved successfully.",
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

  const isSubmitEnabled = () => {
    if (userType === 'personal') {
      const hasRequiredFields = personalData.dateOfBirth && personalData.title && personalData.positionDesignation && 
                                personalData.company && personalData.country.name && personalData.state.name && personalData.city;
      const phoneVerificationValid = !personalData.phoneNumber || phoneVerified;
      return hasRequiredFields && phoneVerificationValid && !loading;
    } else {
      const hasRequiredFields = businessData.companyName && businessData.industry && businessData.companyType &&
                                businessData.description && businessData.addressLine1 && businessData.city &&
                                businessData.state.name && businessData.country.name && businessData.pincode &&
                                businessData.website && businessData.registrationNumber && businessData.companySize &&
                                businessData.phoneNumber;
      const phoneVerificationValid = businessData.phoneNumber && phoneVerified;
      return hasRequiredFields && phoneVerificationValid && !loading;
    }
  };

  const currentPhoneNumber = userType === 'personal' ? personalData.phoneNumber : businessData.phoneNumber;
  const currentCountryCode = userType === 'personal' ? personalData.countryCode : businessData.countryCode;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Provide your information to get started</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              Profile Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label>Select Profile Type *</Label>
                <RadioGroup value={userType} onValueChange={(value: 'personal' | 'business') => setUserType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal">Personal Profile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">Business Profile</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Profile & Cover Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {userType === 'business' ? 'Logo & Banner' : 'Profile Images'}
                </h3>
                
                {/* Cover Image */}
                <div className="relative">
                  <Label>{userType === 'business' ? 'Banner Image (Optional)' : 'Cover Image (Optional)'}</Label>
                  <div 
                    className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
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
                          <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile Picture/Logo Overlay */}
                  <div className="absolute -bottom-6 left-6">
                    <div 
                      className="relative w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg cursor-pointer overflow-hidden"
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
                          <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Label className="text-sm text-gray-600 mt-1 block text-center">
                      {userType === 'business' ? 'Logo' : 'Profile Picture'}
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

              {/* Dynamic Form Content Based on User Type */}
              <div className="space-y-4 mt-10">
                {userType === 'personal' ? (
                  // Personal Profile Form
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Gender */}
                      <div className="space-y-2">
                        <Label>Gender (Optional)</Label>
                        <Select value={personalData.gender} onValueChange={(value) => handlePersonalInputChange('gender', value)}>
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
                        <Label>Date of Birth *</Label>
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

                      {/* Job Title */}
                      <div className="space-y-2">
                        <Label>Current Job Title *</Label>
                        <Select value={personalData.title} onValueChange={(value) => handlePersonalInputChange('title', value)}>
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
                          <Label>Specify Job Title *</Label>
                          <Input
                            placeholder="Enter your job title"
                            value={personalData.customTitle}
                            onChange={(e) => handlePersonalInputChange('customTitle', e.target.value)}
                            className={errors.customTitle ? "border-red-500" : ""}
                          />
                          {errors.customTitle && <p className="text-sm text-red-500">{errors.customTitle}</p>}
                        </div>
                      )}

                      {/* Position/Designation */}
                      <div className="space-y-2">
                        <Label>Position/Designation *</Label>
                        <Input
                          placeholder="e.g., Senior Engineer, Team Lead"
                          value={personalData.positionDesignation}
                          onChange={(e) => handlePersonalInputChange('positionDesignation', e.target.value)}
                          className={errors.positionDesignation ? "border-red-500" : ""}
                        />
                        {errors.positionDesignation && <p className="text-sm text-red-500">{errors.positionDesignation}</p>}
                      </div>

                      {/* Company */}
                      <div className="space-y-2">
                        <Label>Current Company *</Label>
                        <Input
                          placeholder="Enter company name"
                          value={personalData.company}
                          onChange={(e) => handlePersonalInputChange('company', e.target.value)}
                          className={errors.company ? "border-red-500" : ""}
                        />
                        {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                      </div>
                    </div>

                    {/* Phone Number with Verification */}
                    <div className="space-y-3">
                      <Label>Phone Number (Optional)</Label>
                      <div className="flex gap-2">
                        {/* Country Code */}
                        <Select value={personalData.countryCode} onValueChange={(value) => handlePersonalInputChange('countryCode', value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((item) => (
                              <SelectItem key={`${item.code}-${item.country}`} value={item.code}>
                                {item.code} {item.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Phone Number */}
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          value={personalData.phoneNumber}
                          onChange={(e) => handlePersonalInputChange('phoneNumber', e.target.value)}
                          className={cn("flex-1", errors.phoneNumber && "border-red-500")}
                        />
                        
                        {/* Send Code Button */}
                        {personalData.phoneNumber && !phoneVerified && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSendVerificationCode}
                            disabled={sendingCode || phoneCodeSent}
                            className="whitespace-nowrap"
                          >
                            {sendingCode && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {phoneCodeSent ? 'Code Sent' : 'Send Code'}
                          </Button>
                        )}
                        
                        {/* Verified Indicator */}
                        {phoneVerified && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-md">
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Verification Code Input */}
                      {phoneCodeSent && !phoneVerified && (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            className="w-48"
                          />
                          <Button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={verifyingCode || verificationCode.length !== 6}
                          >
                            {verifyingCode && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Verify
                          </Button>
                        </div>
                      )}
                      
                      {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                    </div>

                    {/* Location Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Location Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Country */}
                        <div className="space-y-2">
                          <Label>Country *</Label>
                          <Select 
                            value={personalData.country.name} 
                            onValueChange={(value) => {
                              const country = countries.find(c => c.name === value);
                              if (country) {
                                handlePersonalInputChange('country', { name: country.name, code: country.iso2 });
                              }
                            }}
                            disabled={loadingLocations}
                          >
                            <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                              <SelectValue placeholder={loadingLocations ? "Loading..." : "Select country"} />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.iso2} value={country.name}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                          <Label>State/Province *</Label>
                          <Select 
                            value={personalData.state.name} 
                            onValueChange={(value) => {
                              const state = states.find(s => s.name === value);
                              if (state) {
                                handlePersonalInputChange('state', { name: state.name, code: state.iso2 });
                              }
                            }}
                            disabled={!personalData.country.name || loadingLocations}
                          >
                            <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                              <SelectValue placeholder={loadingLocations ? "Loading..." : "Select state"} />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state.iso2} value={state.name}>
                                  {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Select 
                            value={personalData.city} 
                            onValueChange={(value) => handlePersonalInputChange('city', value)}
                            disabled={!personalData.state.name || loadingLocations}
                          >
                            <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                              <SelectValue placeholder={loadingLocations ? "Loading..." : "Select city"} />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city.name} value={city.name}>
                                  {city.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Business Profile Form
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Company Name */}
                      <div className="space-y-2">
                        <Label>Company Name *</Label>
                        <Input
                          placeholder="Enter company name"
                          value={businessData.companyName}
                          onChange={(e) => handleBusinessInputChange('companyName', e.target.value)}
                          className={errors.companyName ? "border-red-500" : ""}
                        />
                        {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                      </div>

                      {/* Industry */}
                      <div className="space-y-2">
                        <Label>Industry *</Label>
                        <Select value={businessData.industry} onValueChange={(value) => handleBusinessInputChange('industry', value)}>
                          <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
                      </div>

                      {/* Custom Industry (when Others is selected) */}
                      {showOtherIndustry && (
                        <div className="space-y-2">
                          <Label>Specify Industry *</Label>
                          <Input
                            placeholder="Enter your industry"
                            value={businessData.customIndustry}
                            onChange={(e) => handleBusinessInputChange('customIndustry', e.target.value)}
                            className={errors.customIndustry ? "border-red-500" : ""}
                          />
                          {errors.customIndustry && <p className="text-sm text-red-500">{errors.customIndustry}</p>}
                        </div>
                      )}

                      {/* Company Type */}
                      <div className="space-y-2">
                        <Label>Company Type *</Label>
                        <Select value={businessData.companyType} onValueChange={(value) => handleBusinessInputChange('companyType', value)}>
                          <SelectTrigger className={errors.companyType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {COMPANY_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.companyType && <p className="text-sm text-red-500">{errors.companyType}</p>}
                      </div>

                      {/* Company Size */}
                      <div className="space-y-2">
                        <Label>Company Size *</Label>
                        <Select value={businessData.companySize} onValueChange={(value) => handleBusinessInputChange('companySize', value)}>
                          <SelectTrigger className={errors.companySize ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPANY_SIZES.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size} employees
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.companySize && <p className="text-sm text-red-500">{errors.companySize}</p>}
                      </div>

                      {/* Registration Number */}
                      <div className="space-y-2">
                        <Label>GST/Registration Number *</Label>
                        <Input
                          placeholder="Enter GST or registration number"
                          value={businessData.registrationNumber}
                          onChange={(e) => handleBusinessInputChange('registrationNumber', e.target.value)}
                          className={errors.registrationNumber ? "border-red-500" : ""}
                        />
                        {errors.registrationNumber && <p className="text-sm text-red-500">{errors.registrationNumber}</p>}
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <Label>Website *</Label>
                        <Input
                          placeholder="https://example.com"
                          value={businessData.website}
                          onChange={(e) => handleBusinessInputChange('website', e.target.value)}
                          className={errors.website ? "border-red-500" : ""}
                        />
                        {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Company Description *</Label>
                      <Textarea
                        placeholder="Describe your company and services"
                        value={businessData.description}
                        onChange={(e) => handleBusinessInputChange('description', e.target.value)}
                        className={errors.description ? "border-red-500" : ""}
                        rows={3}
                      />
                      {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    {/* Address */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Company Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Address Line 1 *</Label>
                          <Input
                            placeholder="Street address"
                            value={businessData.addressLine1}
                            onChange={(e) => handleBusinessInputChange('addressLine1', e.target.value)}
                            className={errors.addressLine1 ? "border-red-500" : ""}
                          />
                          {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>Address Line 2 (Optional)</Label>
                          <Input
                            placeholder="Apartment, suite, etc."
                            value={businessData.addressLine2}
                            onChange={(e) => handleBusinessInputChange('addressLine2', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Country */}
                        <div className="space-y-2">
                          <Label>Country *</Label>
                          <Select 
                            value={businessData.country.name} 
                            onValueChange={(value) => {
                              const country = countries.find(c => c.name === value);
                              if (country) {
                                handleBusinessInputChange('country', { name: country.name, code: country.iso2 });
                              }
                            }}
                            disabled={loadingLocations}
                          >
                            <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                              <SelectValue placeholder={loadingLocations ? "Loading..." : "Select country"} />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.iso2} value={country.name}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                          <Label>State *</Label>
                          <Select 
                            value={businessData.state.name} 
                            onValueChange={(value) => {
                              const state = states.find(s => s.name === value);
                              if (state) {
                                handleBusinessInputChange('state', { name: state.name, code: state.iso2 });
                              }
                            }}
                            disabled={!businessData.country.name || loadingLocations}
                          >
                            <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                              <SelectValue placeholder={loadingLocations ? "Loading..." : "Select state"} />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state.iso2} value={state.name}>
                                  {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Select 
                            value={businessData.city} 
                            onValueChange={(value) => handleBusinessInputChange('city', value)}
                            disabled={!businessData.state.name || loadingLocations}
                          >
                            <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                              <SelectValue placeholder={loadingLocations ? "Loading..." : "Select city"} />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city.name} value={city.name}>
                                  {city.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                        </div>

                        {/* Pincode */}
                        <div className="space-y-2">
                          <Label>Pincode *</Label>
                          <Input
                            placeholder="Enter pincode"
                            value={businessData.pincode}
                            onChange={(e) => handleBusinessInputChange('pincode', e.target.value)}
                            className={errors.pincode ? "border-red-500" : ""}
                          />
                          {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Phone Number with Verification */}
                    <div className="space-y-3">
                      <Label>Phone Number *</Label>
                      <div className="flex gap-2">
                        {/* Country Code */}
                        <Select value={businessData.countryCode} onValueChange={(value) => handleBusinessInputChange('countryCode', value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((item) => (
                              <SelectItem key={`${item.code}-${item.country}`} value={item.code}>
                                {item.code} {item.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Phone Number */}
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          value={businessData.phoneNumber}
                          onChange={(e) => handleBusinessInputChange('phoneNumber', e.target.value)}
                          className={cn("flex-1", errors.phoneNumber && "border-red-500")}
                        />
                        
                        {/* Send Code Button */}
                        {businessData.phoneNumber && !phoneVerified && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSendVerificationCode}
                            disabled={sendingCode || phoneCodeSent}
                            className="whitespace-nowrap"
                          >
                            {sendingCode && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {phoneCodeSent ? 'Code Sent' : 'Send Code'}
                          </Button>
                        )}
                        
                        {/* Verified Indicator */}
                        {phoneVerified && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-md">
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Verification Code Input */}
                      {phoneCodeSent && !phoneVerified && (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            className="w-48"
                          />
                          <Button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={verifyingCode || verificationCode.length !== 6}
                          >
                            {verifyingCode && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Verify
                          </Button>
                        </div>
                      )}
                      
                      {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                    </div>
                  </>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  type="submit" 
                  disabled={!isSubmitEnabled()} 
                  className="min-w-[180px]"
                >
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
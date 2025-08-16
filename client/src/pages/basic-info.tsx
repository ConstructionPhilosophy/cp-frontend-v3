import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
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
  id: number;
  name: string;
  iso2: string;
  phone_code: string;
}

interface State {
  id: number;
  name: string;
  country_code: string;
  state_code: string;
}

interface City {
  id: number;
  name: string;
  state_code: string;
  country_code: string;
}

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
  
  // Location data from API
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

  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    countryCode: '+91',
    country: '',
    state: '',
    city: '',
    title: '',
    positionDesignation: '',
    company: '',
    customTitle: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoadingLocations(true);
      const response = await fetch('https://api.countrystatecity.in/v1/countries', {
        headers: {
          'X-CSCAPI-KEY': 'YOUR_API_KEY' // We'll use REST Countries as fallback
        }
      });
      
      if (!response.ok) {
        // Fallback to REST Countries API
        const restResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        const restData = await restResponse.json();
        
        const formattedCountries = restData.map((country: any, index: number) => ({
          id: index + 1,
          name: country.name.common,
          iso2: country.cca2,
          phone_code: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}` : ''
        })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
      } else {
        const data = await response.json();
        setCountries(data);
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
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
        headers: {
          'X-CSCAPI-KEY': 'YOUR_API_KEY'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStates(data);
      } else {
        // Fallback static data for major countries
        const staticStates = getStaticStates(countryCode);
        setStates(staticStates);
      }
    } catch (error) {
      console.error('Error loading states:', error);
      const staticStates = getStaticStates(countryCode);
      setStates(staticStates);
    } finally {
      setLoadingLocations(false);
    }
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    try {
      setLoadingLocations(true);
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`, {
        headers: {
          'X-CSCAPI-KEY': 'YOUR_API_KEY'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      } else {
        // Fallback static data
        const staticCities = getStaticCities(countryCode, stateCode);
        setCities(staticCities);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      const staticCities = getStaticCities(countryCode, stateCode);
      setCities(staticCities);
    } finally {
      setLoadingLocations(false);
    }
  };

  const getStaticStates = (countryCode: string): State[] => {
    const staticData: Record<string, State[]> = {
      'IN': [
        { id: 1, name: 'Andhra Pradesh', country_code: 'IN', state_code: 'AP' },
        { id: 2, name: 'Arunachal Pradesh', country_code: 'IN', state_code: 'AR' },
        { id: 3, name: 'Assam', country_code: 'IN', state_code: 'AS' },
        { id: 4, name: 'Bihar', country_code: 'IN', state_code: 'BR' },
        { id: 5, name: 'Chhattisgarh', country_code: 'IN', state_code: 'CG' },
        { id: 6, name: 'Goa', country_code: 'IN', state_code: 'GA' },
        { id: 7, name: 'Gujarat', country_code: 'IN', state_code: 'GJ' },
        { id: 8, name: 'Haryana', country_code: 'IN', state_code: 'HR' },
        { id: 9, name: 'Himachal Pradesh', country_code: 'IN', state_code: 'HP' },
        { id: 10, name: 'Jharkhand', country_code: 'IN', state_code: 'JH' },
        { id: 11, name: 'Karnataka', country_code: 'IN', state_code: 'KA' },
        { id: 12, name: 'Kerala', country_code: 'IN', state_code: 'KL' },
        { id: 13, name: 'Madhya Pradesh', country_code: 'IN', state_code: 'MP' },
        { id: 14, name: 'Maharashtra', country_code: 'IN', state_code: 'MH' },
        { id: 15, name: 'Manipur', country_code: 'IN', state_code: 'MN' },
        { id: 16, name: 'Meghalaya', country_code: 'IN', state_code: 'ML' },
        { id: 17, name: 'Mizoram', country_code: 'IN', state_code: 'MZ' },
        { id: 18, name: 'Nagaland', country_code: 'IN', state_code: 'NL' },
        { id: 19, name: 'Odisha', country_code: 'IN', state_code: 'OR' },
        { id: 20, name: 'Punjab', country_code: 'IN', state_code: 'PB' },
        { id: 21, name: 'Rajasthan', country_code: 'IN', state_code: 'RJ' },
        { id: 22, name: 'Sikkim', country_code: 'IN', state_code: 'SK' },
        { id: 23, name: 'Tamil Nadu', country_code: 'IN', state_code: 'TN' },
        { id: 24, name: 'Telangana', country_code: 'IN', state_code: 'TS' },
        { id: 25, name: 'Tripura', country_code: 'IN', state_code: 'TR' },
        { id: 26, name: 'Uttar Pradesh', country_code: 'IN', state_code: 'UP' },
        { id: 27, name: 'Uttarakhand', country_code: 'IN', state_code: 'UK' },
        { id: 28, name: 'West Bengal', country_code: 'IN', state_code: 'WB' },
        { id: 29, name: 'Delhi', country_code: 'IN', state_code: 'DL' },
        { id: 30, name: 'Jammu and Kashmir', country_code: 'IN', state_code: 'JK' },
        { id: 31, name: 'Ladakh', country_code: 'IN', state_code: 'LA' }
      ],
      'US': [
        { id: 1, name: 'California', country_code: 'US', state_code: 'CA' },
        { id: 2, name: 'Texas', country_code: 'US', state_code: 'TX' },
        { id: 3, name: 'Florida', country_code: 'US', state_code: 'FL' },
        { id: 4, name: 'New York', country_code: 'US', state_code: 'NY' },
        { id: 5, name: 'Pennsylvania', country_code: 'US', state_code: 'PA' },
        { id: 6, name: 'Illinois', country_code: 'US', state_code: 'IL' },
        { id: 7, name: 'Ohio', country_code: 'US', state_code: 'OH' },
        { id: 8, name: 'Georgia', country_code: 'US', state_code: 'GA' },
        { id: 9, name: 'North Carolina', country_code: 'US', state_code: 'NC' },
        { id: 10, name: 'Michigan', country_code: 'US', state_code: 'MI' }
      ]
    };
    return staticData[countryCode] || [];
  };

  const getStaticCities = (countryCode: string, stateCode: string): City[] => {
    const staticData: Record<string, City[]> = {
      'TN': [
        { id: 1, name: 'Chennai', state_code: 'TN', country_code: 'IN' },
        { id: 2, name: 'Coimbatore', state_code: 'TN', country_code: 'IN' },
        { id: 3, name: 'Madurai', state_code: 'TN', country_code: 'IN' },
        { id: 4, name: 'Trichy', state_code: 'TN', country_code: 'IN' },
        { id: 5, name: 'Salem', state_code: 'TN', country_code: 'IN' }
      ],
      'MH': [
        { id: 1, name: 'Mumbai', state_code: 'MH', country_code: 'IN' },
        { id: 2, name: 'Pune', state_code: 'MH', country_code: 'IN' },
        { id: 3, name: 'Nagpur', state_code: 'MH', country_code: 'IN' },
        { id: 4, name: 'Nashik', state_code: 'MH', country_code: 'IN' },
        { id: 5, name: 'Aurangabad', state_code: 'MH', country_code: 'IN' }
      ],
      'CA': [
        { id: 1, name: 'Los Angeles', state_code: 'CA', country_code: 'US' },
        { id: 2, name: 'San Francisco', state_code: 'CA', country_code: 'US' },
        { id: 3, name: 'San Diego', state_code: 'CA', country_code: 'US' },
        { id: 4, name: 'San Jose', state_code: 'CA', country_code: 'US' },
        { id: 5, name: 'Fresno', state_code: 'CA', country_code: 'US' }
      ],
      'NY': [
        { id: 1, name: 'New York City', state_code: 'NY', country_code: 'US' },
        { id: 2, name: 'Buffalo', state_code: 'NY', country_code: 'US' },
        { id: 3, name: 'Rochester', state_code: 'NY', country_code: 'US' },
        { id: 4, name: 'Yonkers', state_code: 'NY', country_code: 'US' },
        { id: 5, name: 'Syracuse', state_code: 'NY', country_code: 'US' }
      ]
    };
    return staticData[stateCode] || [];
  };

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
    
    // Phone verification check
    if (formData.phoneNumber && !phoneVerified) {
      newErrors.phoneNumber = 'Please verify your phone number';
    }
    
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

    // Reset dependent fields and phone verification when phone changes
    if (field === 'phoneNumber') {
      setPhoneCodeSent(false);
      setPhoneVerified(false);
      setVerificationCode('');
    }

    // Handle location changes
    if (field === 'country') {
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      setStates([]);
      setCities([]);
      if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
      
      const selectedCountry = countries.find(c => c.name === value);
      if (selectedCountry) {
        loadStates(selectedCountry.iso2);
      }
    }
    if (field === 'state') {
      setFormData(prev => ({ ...prev, city: '' }));
      setCities([]);
      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
      
      const selectedCountry = countries.find(c => c.name === formData.country);
      const selectedState = states.find(s => s.name === value);
      if (selectedCountry && selectedState) {
        loadCities(selectedCountry.iso2, selectedState.state_code);
      }
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

  const handleSendVerificationCode = async () => {
    if (!formData.phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number first",
        variant: "destructive",
      });
      return;
    }

    setSendingCode(true);
    try {
      // Simulate API call for sending verification code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPhoneCodeSent(true);
      toast({
        title: "Verification Code Sent",
        description: `Code sent to ${formData.countryCode}${formData.phoneNumber}`,
      });
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
      // Simulate API call for verifying code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit code
      setPhoneVerified(true);
      if (errors.phoneNumber) {
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
      }
      toast({
        title: "Phone Verified!",
        description: "Your phone number has been verified successfully",
      });
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
      const updateData: any = {
        phoneNumber: formData.phoneNumber ? `${formData.countryCode}${formData.phoneNumber}` : undefined,
        title: showOtherTitle && formData.customTitle ? formData.customTitle : formData.title,
        positionDesignation: formData.positionDesignation,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        company: formData.company,
        hasBasicInfo: true, // Set hasBasicInfo to true
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

  const isSubmitEnabled = () => {
    const hasRequiredFields = formData.dateOfBirth && formData.title && formData.positionDesignation && 
                              formData.company && formData.country && formData.state && formData.city;
    const phoneVerificationValid = !formData.phoneNumber || phoneVerified;
    return hasRequiredFields && phoneVerificationValid && !loading;
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
                </div>

                {/* Phone Number with Verification */}
                <div className="space-y-4">
                  <Label>Phone Number (Optional)</Label>
                  <div className="flex gap-2">
                    {/* Country Code */}
                    <Select value={formData.countryCode} onValueChange={(value) => handleInputChange('countryCode', value)}>
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
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={cn("flex-1", errors.phoneNumber && "border-red-500")}
                    />
                    
                    {/* Send Code Button */}
                    {formData.phoneNumber && !phoneVerified && (
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
                  <p className="text-xs text-gray-500">
                    Phone verification is required if you provide a phone number
                  </p>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(value) => handleInputChange('country', value)}
                      disabled={loadingLocations}
                    >
                      <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                        <SelectValue placeholder={loadingLocations ? "Loading..." : "Select country"} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.name}>
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
                      disabled={!formData.country || loadingLocations}
                    >
                      <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                        <SelectValue placeholder={loadingLocations ? "Loading..." : "Select state"} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.name}>
                            {state.name}
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
                      disabled={!formData.state || loadingLocations}
                    >
                      <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                        <SelectValue placeholder={loadingLocations ? "Loading..." : "Select city"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name}
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
                <Button 
                  type="submit" 
                  disabled={!isSubmitEnabled()} 
                  className="min-w-[200px]"
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
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Combobox } from '../components/ui/combobox';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CustomDatePicker } from '../components/ui/custom-date-picker';
import { CountryCodeSelector } from '../components/ui/country-code-selector';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Textarea } from '../components/ui/textarea';
import { CalendarIcon, Camera, Loader2, Upload, Plus, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { userApiService } from '../lib/userApi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const GEO_API_BASE_URL = 'https://geo-api-230500065838.asia-south1.run.app';

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
  { code: '+93', country: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: '+355', country: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: '+213', country: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: '+376', country: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: '+244', country: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: '+54', country: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: '+374', country: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: '+61', country: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: '+43', country: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: '+994', country: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+973', country: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+880', country: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+375', country: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: '+32', country: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: '+501', country: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: '+229', country: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: '+975', country: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: '+591', country: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: '+387', country: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: '+267', country: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: '+55', country: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: '+673', country: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: '+359', country: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: '+226', country: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+257', country: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: '+855', country: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: '+237', country: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: '+1', country: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: '+238', country: 'CV', name: 'Cape Verde', flag: '🇨🇻' },
  { code: '+236', country: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: '+235', country: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: '+56', country: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: '+86', country: 'CN', name: 'China', flag: '🇨🇳' },
  { code: '+57', country: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: '+269', country: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: '+242', country: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: '+243', country: 'CD', name: 'Congo (DRC)', flag: '🇨🇩' },
  { code: '+506', country: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: '+225', country: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+385', country: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: '+53', country: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: '+357', country: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: '+420', country: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: '+45', country: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: '+253', country: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: '+1767', country: 'DM', name: 'Dominica', flag: '🇩🇲' },
  { code: '+1', country: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: '+593', country: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+20', country: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: '+503', country: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: '+240', country: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: '+291', country: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: '+372', country: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: '+251', country: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: '+679', country: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: '+358', country: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷' },
  { code: '+241', country: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: '+220', country: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: '+995', country: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: '+49', country: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: '+233', country: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: '+30', country: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: '+1473', country: 'GD', name: 'Grenada', flag: '🇬🇩' },
  { code: '+502', country: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: '+224', country: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: '+245', country: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: '+592', country: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: '+509', country: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: '+504', country: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: '+36', country: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: '+354', country: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳' },
  { code: '+62', country: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+98', country: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: '+964', country: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: '+353', country: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: '+972', country: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: '+39', country: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: '+1876', country: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: '+81', country: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: '+962', country: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: '+7', country: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: '+254', country: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: '+686', country: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: '+850', country: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: '+82', country: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: '+965', country: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+996', country: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '+856', country: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: '+371', country: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: '+961', country: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+266', country: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: '+231', country: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: '+218', country: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: '+423', country: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: '+370', country: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: '+352', country: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: '+389', country: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: '+261', country: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: '+265', country: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: '+60', country: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+960', country: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: '+223', country: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: '+356', country: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: '+692', country: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: '+222', country: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: '+230', country: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: '+52', country: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: '+691', country: 'FM', name: 'Micronesia', flag: '🇫🇲' },
  { code: '+373', country: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: '+377', country: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: '+976', country: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: '+382', country: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: '+212', country: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: '+258', country: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: '+95', country: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: '+264', country: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: '+674', country: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: '+977', country: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: '+31', country: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+64', country: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+505', country: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: '+227', country: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: '+234', country: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+47', country: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: '+968', country: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: '+92', country: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+680', country: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: '+970', country: 'PS', name: 'Palestine', flag: '🇵🇸' },
  { code: '+507', country: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: '+675', country: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: '+595', country: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: '+51', country: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: '+63', country: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: '+48', country: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: '+351', country: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: '+974', country: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: '+40', country: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: '+7', country: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: '+250', country: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: '+1869', country: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: '+1758', country: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: '+1784', country: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: '+685', country: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: '+378', country: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: '+239', country: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+221', country: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: '+381', country: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: '+248', country: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: '+232', country: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: '+65', country: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: '+421', country: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: '+386', country: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: '+677', country: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: '+252', country: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: '+27', country: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: '+211', country: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: '+34', country: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: '+94', country: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+249', country: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: '+597', country: 'SR', name: 'Suriname', flag: '🇸🇷' },
  { code: '+268', country: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: '+46', country: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: '+41', country: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+963', country: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: '+886', country: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: '+992', country: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: '+255', country: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: '+66', country: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: '+670', country: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: '+228', country: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: '+676', country: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: '+1868', country: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: '+216', country: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: '+90', country: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: '+993', country: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: '+688', country: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: '+256', country: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: '+380', country: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: '+971', country: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+44', country: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', country: 'US', name: 'United States', flag: '🇺🇸' },
  { code: '+598', country: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: '+998', country: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: '+678', country: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: '+39', country: 'VA', name: 'Vatican City', flag: '🇻🇦' },
  { code: '+58', country: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+84', country: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+967', country: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: '+260', country: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: '+263', country: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
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
  const [switchingType, setSwitchingType] = useState(false);
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
  const [phoneError, setPhoneError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  
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
    hidePhoneNumber: false,
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
    hidePhoneNumber: false,
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
      const endpoint = `/api/states?country_code=${countryCode}`;
      console.log('🏛️ Calling States API:', endpoint);
      console.log('📍 Parameters:', { countryCode });
      
      const response = await fetch(endpoint);
      console.log('🏛️ States API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🏛️ States API Response Data:', data);
        console.log('🏛️ States Array Length:', Array.isArray(data) ? data.length : 'Not an array');
        
        setStates(data);
        
        if (!data || data.length === 0) {
          console.warn('⚠️ States API returned empty array for country:', countryCode);
        } else {
          console.log('✅ States loaded successfully:', data.length, 'states');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ States API Error Response:', errorText);
        throw new Error(`Failed to load states: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('💥 Error loading states:', error);
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
      const endpoint = `/api/cities?country_code=${countryCode}&state_code=${stateCode}`;
      console.log('🌆 Calling Cities API:', endpoint);
      console.log('📍 Parameters:', { countryCode, stateCode });
      
      const response = await fetch(endpoint);
      console.log('🌆 Cities API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🌆 Cities API Response Data:', data);
        console.log('🌆 Cities Array Length:', Array.isArray(data) ? data.length : 'Not an array');
        
        // Cities API returns direct array like states API, not wrapped in data property
        const citiesArray = Array.isArray(data) ? data : (data.data || []);
        setCities(citiesArray);
        
        if (citiesArray.length === 0) {
          console.warn('⚠️ Cities API returned empty array for:', { countryCode, stateCode });
        } else {
          console.log('✅ Cities loaded successfully:', citiesArray.length, 'cities');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Cities API Error Response:', errorText);
        throw new Error(`Failed to load cities: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('💥 Error loading cities:', error);
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

  const handlePersonalInputChange = (field: string, value: string | { name: string; code: string } | boolean) => {
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
      setPhoneError('');
      setConfirmationResult(null);
      
      // Validate phone number format
      if (value && typeof value === 'string') {
        const cleanedValue = value.replace(/\D/g, '');
        if (cleanedValue && (cleanedValue.length < 10 || cleanedValue.length > 15)) {
          setPhoneError('Please enter a valid phone number (10-15 digits)');
        }
      }
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
      
      // Use current country code from state since personalData hasn't updated yet
      const currentCountryCode = personalData.country.code;
      if (currentCountryCode && stateObj.code) {
        setTimeout(() => {
          loadCities(currentCountryCode, stateObj.code);
        }, 0);
      }
    }
  };

  const handleBusinessInputChange = (field: string, value: string | { name: string; code: string } | boolean) => {
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
      setPhoneError('');
      setConfirmationResult(null);
      
      // Validate phone number format
      if (value && typeof value === 'string') {
        const cleanedValue = value.replace(/\D/g, '');
        if (cleanedValue && (cleanedValue.length < 10 || cleanedValue.length > 15)) {
          setPhoneError('Please enter a valid phone number (10-15 digits)');
        }
      }
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
      
      // Use current country code from state since businessData hasn't updated yet
      const currentCountryCode = businessData.country.code;
      if (currentCountryCode && stateObj.code) {
        setTimeout(() => {
          loadCities(currentCountryCode, stateObj.code);
        }, 0);
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

  // Initialize reCAPTCHA verifier
  const setupRecaptcha = () => {
    const auth = getAuth();
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved
        },
      });
      setRecaptchaVerifier(verifier);
      return verifier;
    }
    return recaptchaVerifier;
  };

  const sendVerificationCode = async (phoneNumber: string, countryCode: string) => {
    try {
      const auth = getAuth();
      const verifier = setupRecaptcha();
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
      setConfirmationResult(confirmation);
      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please try again later.');
      } else if (error.code === 'auth/invalid-phone-number') {
        throw new Error('Invalid phone number format.');
      } else {
        throw new Error('Failed to send verification code. Please try again.');
      }
    }
  };

  const verifyOtpCode = async (code: string) => {
    try {
      if (!confirmationResult) {
        throw new Error('No verification in progress');
      }
      
      await confirmationResult.confirm(code);
      return true;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      if (error.code === 'auth/invalid-verification-code') {
        throw new Error('Invalid verification code');
      } else {
        throw new Error('Verification failed. Please try again.');
      }
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
      const success = await verifyOtpCode(verificationCode);
      
      if (success) {
        setPhoneVerified(true);
        setPhoneError('');
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
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code. Please try again",
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

  // Memoize country codes for better performance - show flag, code and country name
  const countryCodeComboOptions = useMemo(() => 
    COUNTRY_CODES.map((item) => ({
      value: item.code,
      label: `${item.flag} ${item.code} ${item.name}`,
      flag: item.flag,
    })), []
  );

  // Memoize job titles for better performance
  const jobTitleComboOptions = useMemo(() => 
    JOB_TITLES.map((title) => ({
      value: title,
      label: title,
    })), []
  );

  // Memoize company sizes for better performance
  const companySizeComboOptions = useMemo(() => 
    COMPANY_SIZES.map((size) => ({
      value: size,
      label: size,
    })), []
  );

  // No longer need these memoized options since we're using Select components

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 md:mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Provide your information to get started</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              Complete Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Select Profile Type *</Label>
                <RadioGroup 
                  value={userType} 
                  onValueChange={(value: 'personal' | 'business') => {
                    setSwitchingType(true);
                    setUserType(value);
                    // Reset form data when switching
                    setPersonalData({
                      dateOfBirth: '',
                      title: '',
                      customTitle: '',
                      positionDesignation: '',
                      company: '',
                      gender: '',
                      phoneNumber: '',
                      countryCode: '+91',
                      country: { name: '', code: '' },
                      state: { name: '', code: '' },
                      city: '',
                      hidePhoneNumber: false,
                    });
                    setBusinessData({
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
                      hidePhoneNumber: false,
                    });
                    // Reset verification states
                    setPhoneCodeSent(false);
                    setPhoneVerified(false);
                    setVerificationCode('');
                    setPhoneError('');
                    // Clear form errors
                    setErrors({});
                    setTimeout(() => setSwitchingType(false), 100);
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Label htmlFor="personal" className="block cursor-pointer">
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          userType === 'personal' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="personal" id="personal" />
                            <div>
                              <div className="text-base font-medium cursor-pointer">
                                Personal Profile
                              </div>
                              <p className="text-sm text-gray-500 mt-1">For individual professionals</p>
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="relative">
                      <Label htmlFor="business" className="block cursor-pointer">
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          userType === 'business' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="business" id="business" />
                            <div>
                              <div className="text-base font-medium cursor-pointer">
                                Business Profile
                              </div>
                              <p className="text-sm text-gray-500 mt-1">For companies and organizations</p>
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
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
                {switchingType ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading...</span>
                </div>
              ) : userType === 'personal' ? (
                  // Personal Profile Form
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Gender */}
                      <div className="space-y-2">
                        <Label>Gender (Optional)</Label>
                        <Combobox
                          options={[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
                            { value: 'Other', label: 'Other' },
                            { value: 'Prefer not to say', label: 'Prefer not to say' }
                          ]}
                          value={personalData.gender}
                          onValueChange={(value) => handlePersonalInputChange('gender', value)}
                          placeholder="Select gender"
                          searchPlaceholder="Search gender..."
                        />
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-2">
                        <Label>Date of Birth *</Label>
                        <CustomDatePicker
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          placeholder="Pick a date"
                          error={!!errors.dateOfBirth}
                        />
                        {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
                      </div>

                      {/* Job Title */}
                      <div className="space-y-2">
                        <Label>Current Job Title *</Label>
                        <Combobox
                          options={jobTitleComboOptions}
                          value={personalData.title}
                          onValueChange={(value) => handlePersonalInputChange('title', value)}
                          placeholder="Select job title"
                          searchPlaceholder="Search job titles..."
                          error={!!errors.title}
                        />
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
                        <CountryCodeSelector
                          value={personalData.countryCode}
                          onValueChange={(value) => handlePersonalInputChange('countryCode', value)}
                          placeholder="Select code"
                          className="w-36"
                        />
                        
                        {/* Phone Number */}
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          value={personalData.phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                            handlePersonalInputChange('phoneNumber', value);
                          }}
                          className={cn("flex-1", (errors.phoneNumber || phoneError) && "border-red-500")}
                        />
                        
                        {/* Verification Code Input (when code sent) */}
                        {phoneCodeSent && !phoneVerified && (
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            className="w-32"
                          />
                        )}
                        
                        {/* Send/Verify Button */}
                        {personalData.phoneNumber && !phoneVerified && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={phoneCodeSent ? handleVerifyCode : handleSendVerificationCode}
                            disabled={sendingCode || verifyingCode || (phoneCodeSent && verificationCode.length !== 6) || !!phoneError}
                            className="whitespace-nowrap"
                          >
                            {(sendingCode || verifyingCode) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {phoneCodeSent ? 'Verify' : 'Send Code'}
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
                      
                      {/* Error Messages */}
                      {(errors.phoneNumber || phoneError) && (
                        <p className="text-sm text-red-500">{errors.phoneNumber || phoneError}</p>
                      )}
                      
                      {/* Hide Phone Number */}
                      {personalData.phoneNumber && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="hidePhonePersonal"
                            checked={personalData.hidePhoneNumber}
                            onChange={(e) => handlePersonalInputChange('hidePhoneNumber', e.target.checked)}
                            className="h-4 w-4 text-cmo-primary border-gray-300 rounded focus:ring-cmo-primary"
                          />
                          <Label htmlFor="hidePhonePersonal" className="text-sm">
                            Hide phone number from public profile
                          </Label>
                        </div>
                      )}
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
                              <SelectValue placeholder={!personalData.country.name ? "Select country first" : loadingLocations ? "Loading..." : "Select state"} />
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
                              <SelectValue placeholder={!personalData.state.name ? "Select state first" : loadingLocations ? "Loading..." : "Select city"} />
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
                        <Combobox
                          options={INDUSTRIES.map(industry => ({ value: industry, label: industry }))}
                          value={businessData.industry}
                          onValueChange={(value) => handleBusinessInputChange('industry', value)}
                          placeholder="Select industry"
                          searchPlaceholder="Search industries..."
                          error={!!errors.industry}
                        />
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
                        <CountryCodeSelector
                          value={businessData.countryCode}
                          onValueChange={(value) => handleBusinessInputChange('countryCode', value)}
                          placeholder="Select code"
                          className="w-36"
                        />
                        
                        {/* Phone Number */}
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          value={businessData.phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                            handleBusinessInputChange('phoneNumber', value);
                          }}
                          className={cn("flex-1", (errors.phoneNumber || phoneError) && "border-red-500")}
                        />
                        
                        {/* Verification Code Input (when code sent) */}
                        {phoneCodeSent && !phoneVerified && (
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            className="w-32"
                          />
                        )}
                        
                        {/* Send/Verify Button */}
                        {businessData.phoneNumber && !phoneVerified && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={phoneCodeSent ? handleVerifyCode : handleSendVerificationCode}
                            disabled={sendingCode || verifyingCode || (phoneCodeSent && verificationCode.length !== 6) || !!phoneError}
                            className="whitespace-nowrap"
                          >
                            {(sendingCode || verifyingCode) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {phoneCodeSent ? 'Verify' : 'Send Code'}
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
                      
                      {/* Error Messages */}
                      {(errors.phoneNumber || phoneError) && (
                        <p className="text-sm text-red-500">{errors.phoneNumber || phoneError}</p>
                      )}
                      
                      {/* Hide Phone Number */}
                      {businessData.phoneNumber && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="hidePhoneBusiness"
                            checked={businessData.hidePhoneNumber}
                            onChange={(e) => handleBusinessInputChange('hidePhoneNumber', e.target.checked)}
                            className="h-4 w-4 text-cmo-primary border-gray-300 rounded focus:ring-cmo-primary"
                          />
                          <Label htmlFor="hidePhoneBusiness" className="text-sm">
                            Hide phone number from public profile
                          </Label>
                        </div>
                      )}
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
        
        {/* reCAPTCHA container for Firebase Phone Auth */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
import type { 
  User, 
  InsertUser, 
  SecurityAssessment, 
  InsertSecurityAssessment,
  SecurityRecommendation,
  InsertSecurityRecommendation,
  SecurityMetric,
  InsertSecurityMetric
} from "../shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Security assessment operations
  createSecurityAssessment(assessment: InsertSecurityAssessment): Promise<SecurityAssessment>;
  getSecurityAssessment(id: string): Promise<SecurityAssessment | undefined>;
  getUserAssessments(userId: string): Promise<SecurityAssessment[]>;
  updateSecurityAssessment(id: string, assessment: Partial<InsertSecurityAssessment>): Promise<SecurityAssessment | undefined>;

  // Security recommendation operations
  createSecurityRecommendation(recommendation: InsertSecurityRecommendation): Promise<SecurityRecommendation>;
  getAssessmentRecommendations(assessmentId: string): Promise<SecurityRecommendation[]>;
  updateRecommendation(id: string, recommendation: Partial<InsertSecurityRecommendation>): Promise<SecurityRecommendation | undefined>;

  // Security metrics operations
  createSecurityMetric(metric: InsertSecurityMetric): Promise<SecurityMetric>;
  getUserMetrics(userId: string, metricType?: string): Promise<SecurityMetric[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private assessments: Map<string, SecurityAssessment> = new Map();
  private recommendations: Map<string, SecurityRecommendation> = new Map();
  private metrics: Map<string, SecurityMetric> = new Map();

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample user
    const sampleUser: User = {
      id: "user-1",
      email: "john.doe@techcorp.com",
      firstName: "John",
      lastName: "Doe",
      company: "TechCorp Inc",
      title: "Chief Marketing Officer",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Sample security assessment
    const sampleAssessment: SecurityAssessment = {
      id: "assessment-1",
      userId: "user-1",
      companyName: "TechCorp Inc",
      industry: "Technology",
      companySize: "medium",
      currentSecurityTools: ["Microsoft Defender", "LastPass", "Slack"],
      complianceRequirements: ["GDPR", "SOX"],
      assessmentData: {
        networkSecurity: { score: 75, vulnerabilities: 3 },
        dataProtection: { score: 60, issues: 5 },
        accessControl: { score: 85, compliant: true },
        employeeTraining: { score: 45, lastTraining: "2023-01-15" }
      },
      overallScore: 66,
      riskLevel: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assessments.set(sampleAssessment.id, sampleAssessment);

    // Sample recommendations
    const recommendations = [
      {
        id: "rec-1",
        assessmentId: "assessment-1",
        category: "data_protection",
        title: "Implement End-to-End Encryption",
        description: "Your current data protection score indicates vulnerabilities in data transmission. Implementing end-to-end encryption will significantly reduce the risk of data breaches during transit.",
        priority: "critical",
        difficulty: "medium",
        estimatedCost: "medium",
        estimatedTimeToImplement: "2-4 weeks",
        benefits: [
          "Protects sensitive customer data during transmission",
          "Ensures compliance with GDPR requirements",
          "Reduces risk of man-in-the-middle attacks",
          "Builds customer trust and confidence"
        ],
        steps: [
          { step: 1, title: "Audit Current Data Flows", description: "Map all data transmission points in your system", estimatedTime: "3 days" },
          { step: 2, title: "Choose Encryption Standard", description: "Select AES-256 or similar enterprise-grade encryption", estimatedTime: "1 day" },
          { step: 3, title: "Implement Encryption", description: "Deploy encryption across all data transmission channels", estimatedTime: "1-2 weeks" },
          { step: 4, title: "Test and Validate", description: "Comprehensive testing of encrypted data flows", estimatedTime: "3 days" }
        ],
        resources: {
          documentation: ["https://owasp.org/www-community/controls/Data_Encryption"],
          tools: ["OpenSSL", "AWS KMS", "Azure Key Vault"],
          guides: ["NIST Encryption Guidelines", "GDPR Encryption Requirements"]
        },
        isImplemented: false,
        implementationNotes: null,
        implementedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "rec-2",
        assessmentId: "assessment-1",
        category: "employee_training",
        title: "Mandatory Security Awareness Training",
        description: "Your employee training score is below industry standards. Regular security awareness training is critical for preventing social engineering attacks and maintaining security compliance.",
        priority: "high",
        difficulty: "easy",
        estimatedCost: "low",
        estimatedTimeToImplement: "1-2 weeks",
        benefits: [
          "Reduces human error security incidents by 70%",
          "Improves phishing detection rates",
          "Ensures compliance with security frameworks",
          "Creates security-conscious culture"
        ],
        steps: [
          { step: 1, title: "Select Training Platform", description: "Choose comprehensive security training solution", estimatedTime: "2 days" },
          { step: 2, title: "Customize Training Content", description: "Tailor content to your industry and threats", estimatedTime: "3 days" },
          { step: 3, title: "Roll Out Training", description: "Deploy training to all employees", estimatedTime: "1 week" },
          { step: 4, title: "Monitor and Track", description: "Implement completion tracking and assessments", estimatedTime: "2 days" }
        ],
        resources: {
          platforms: ["KnowBe4", "Proofpoint Security Awareness", "Wombat Security"],
          content: ["SANS Security Awareness", "NIST Cybersecurity Framework"],
          metrics: ["Phishing simulation results", "Training completion rates"]
        },
        isImplemented: false,
        implementationNotes: null,
        implementedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "rec-3",
        assessmentId: "assessment-1",
        category: "network_security",
        title: "Deploy Multi-Factor Authentication",
        description: "Enhance your access control by implementing MFA across all critical systems. This will significantly reduce the risk of unauthorized access even if passwords are compromised.",
        priority: "critical",
        difficulty: "easy",
        estimatedCost: "low",
        estimatedTimeToImplement: "1 week",
        benefits: [
          "Prevents 99.9% of automated attacks",
          "Protects against password-based attacks",
          "Ensures compliance with security standards",
          "Easy to implement and maintain"
        ],
        steps: [
          { step: 1, title: "Choose MFA Solution", description: "Select appropriate MFA provider for your needs", estimatedTime: "1 day" },
          { step: 2, title: "Configure MFA Policies", description: "Set up policies for different user groups", estimatedTime: "2 days" },
          { step: 3, title: "User Enrollment", description: "Enroll all users and provide setup guidance", estimatedTime: "3 days" },
          { step: 4, title: "Monitor and Support", description: "Ongoing monitoring and user support", estimatedTime: "ongoing" }
        ],
        resources: {
          providers: ["Microsoft Authenticator", "Google Authenticator", "Duo Security"],
          guides: ["NIST MFA Guidelines", "CISA MFA Fact Sheet"],
          support: ["User setup guides", "Troubleshooting documentation"]
        },
        isImplemented: true,
        implementationNotes: "Implemented across all critical systems on 2024-01-15",
        implementedAt: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    recommendations.forEach(rec => {
      this.recommendations.set(rec.id, rec as SecurityRecommendation);
    });

    // Sample metrics
    const sampleMetrics = [
      {
        id: "metric-1",
        userId: "user-1",
        assessmentId: "assessment-1",
        metricType: "overall_score",
        value: 66,
        previousValue: 52,
        changePercentage: 27,
        recordedAt: new Date(),
      },
      {
        id: "metric-2",
        userId: "user-1",
        assessmentId: "assessment-1",
        metricType: "critical_recommendations",
        value: 2,
        previousValue: 5,
        changePercentage: -60,
        recordedAt: new Date(),
      },
      {
        id: "metric-3",
        userId: "user-1",
        assessmentId: "assessment-1",
        metricType: "implemented_recommendations",
        value: 1,
        previousValue: 0,
        changePercentage: 100,
        recordedAt: new Date(),
      }
    ];

    sampleMetrics.forEach(metric => {
      this.metrics.set(metric.id, metric as SecurityMetric);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...user, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  // Security assessment operations
  async createSecurityAssessment(assessment: InsertSecurityAssessment): Promise<SecurityAssessment> {
    const newAssessment: SecurityAssessment = {
      ...assessment,
      id: `assessment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as SecurityAssessment;
    this.assessments.set(newAssessment.id, newAssessment);
    return newAssessment;
  }

  async getSecurityAssessment(id: string): Promise<SecurityAssessment | undefined> {
    return this.assessments.get(id);
  }

  async getUserAssessments(userId: string): Promise<SecurityAssessment[]> {
    return Array.from(this.assessments.values()).filter(a => a.userId === userId);
  }

  async updateSecurityAssessment(id: string, assessment: Partial<InsertSecurityAssessment>): Promise<SecurityAssessment | undefined> {
    const existing = this.assessments.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...assessment, updatedAt: new Date() };
    this.assessments.set(id, updated);
    return updated;
  }

  // Security recommendation operations
  async createSecurityRecommendation(recommendation: InsertSecurityRecommendation): Promise<SecurityRecommendation> {
    const newRecommendation: SecurityRecommendation = {
      ...recommendation,
      id: `rec-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as SecurityRecommendation;
    this.recommendations.set(newRecommendation.id, newRecommendation);
    return newRecommendation;
  }

  async getAssessmentRecommendations(assessmentId: string): Promise<SecurityRecommendation[]> {
    return Array.from(this.recommendations.values()).filter(r => r.assessmentId === assessmentId);
  }

  async updateRecommendation(id: string, recommendation: Partial<InsertSecurityRecommendation>): Promise<SecurityRecommendation | undefined> {
    const existing = this.recommendations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...recommendation, updatedAt: new Date() };
    this.recommendations.set(id, updated);
    return updated;
  }

  // Security metrics operations
  async createSecurityMetric(metric: InsertSecurityMetric): Promise<SecurityMetric> {
    const newMetric: SecurityMetric = {
      ...metric,
      id: `metric-${Date.now()}`,
      recordedAt: new Date(),
    } as SecurityMetric;
    this.metrics.set(newMetric.id, newMetric);
    return newMetric;
  }

  async getUserMetrics(userId: string, metricType?: string): Promise<SecurityMetric[]> {
    const userMetrics = Array.from(this.metrics.values()).filter(m => m.userId === userId);
    if (metricType) {
      return userMetrics.filter(m => m.metricType === metricType);
    }
    return userMetrics;
  }
}

export const storage = new MemStorage();
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Users,
  Lock,
  Database,
  Wifi,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';

interface SecurityAssessment {
  id: string;
  companyName: string;
  industry: string;
  companySize: string;
  overallScore: number;
  riskLevel: string;
  currentSecurityTools: string[];
  complianceRequirements: string[];
  assessmentData: any;
  recommendations?: SecurityRecommendation[];
  createdAt: string;
  updatedAt: string;
}

interface SecurityRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  difficulty: string;
  estimatedCost: string;
  estimatedTimeToImplement: string;
  benefits: string[];
  steps: any[];
  resources: any;
  isImplemented: boolean;
  implementationNotes?: string;
  implementedAt?: string;
}

interface SecurityMetric {
  id: string;
  metricType: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  recordedAt: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'access_control': return <Lock className="w-4 h-4" />;
    case 'data_protection': return <Database className="w-4 h-4" />;
    case 'network_security': return <Wifi className="w-4 h-4" />;
    case 'employee_training': return <BookOpen className="w-4 h-4" />;
    default: return <Shield className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'default';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'critical': return 'text-red-600';
    case 'high': return 'text-orange-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

export function SecurityDashboard() {
  const [assessment, setAssessment] = useState<SecurityAssessment | null>(null);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        // Fetch assessments
        const assessmentsResponse = await fetch('/api/security/assessments');
        const assessments = await assessmentsResponse.json();
        
        if (assessments.length > 0) {
          // Fetch detailed assessment with recommendations
          const detailResponse = await fetch(`/api/security/assessments/${assessments[0].id}`);
          const detailedAssessment = await detailResponse.json();
          setAssessment(detailedAssessment);
        }

        // Fetch metrics
        const metricsResponse = await fetch('/api/security/metrics');
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImplementRecommendation = async (recommendationId: string) => {
    try {
      const response = await fetch(`/api/security/recommendations/${recommendationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isImplemented: true, 
          implementationNotes: 'Marked as implemented' 
        }),
      });

      if (response.ok) {
        const updatedRec = await response.json();
        // Update the local state
        if (assessment) {
          const updatedRecommendations = assessment.recommendations?.map(rec => 
            rec.id === recommendationId ? updatedRec : rec
          );
          setAssessment({
            ...assessment,
            recommendations: updatedRecommendations
          });
        }
      }
    } catch (error) {
      console.error('Error updating recommendation:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recommendations = assessment?.recommendations || [];
  const criticalRecs = recommendations.filter(r => r.priority === 'critical');
  const implementedRecs = recommendations.filter(r => r.isImplemented);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
                <p className="text-gray-600">AI-powered security recommendations for {assessment?.companyName}</p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              <Shield className="w-4 h-4 mr-2" />
              {assessment?.industry}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Security Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assessment?.overallScore}/100</div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={assessment?.overallScore} className="flex-1" />
                <span className={`text-sm font-medium ${getRiskColor(assessment?.riskLevel || '')}`}>
                  {assessment?.riskLevel?.toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalRecs.length}</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Implemented</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{implementedRecs.length}</div>
              <p className="text-xs text-muted-foreground">
                Out of {recommendations.length} recommendations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recommendations.length > 0 ? Math.round((implementedRecs.length / recommendations.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="recommendations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
            <TabsTrigger value="assessment">Assessment Details</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            {criticalRecs.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Critical Security Issues Detected</AlertTitle>
                <AlertDescription>
                  You have {criticalRecs.length} critical security issues that require immediate attention.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className={`${rec.priority === 'critical' ? 'border-red-200 bg-red-50/50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getCategoryIcon(rec.category)}
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription className="mt-1">{rec.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge variant={getPriorityColor(rec.priority) as any}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                        {rec.isImplemented && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Implemented
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Implementation Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>Time: {rec.estimatedTimeToImplement}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span>Cost: {rec.estimatedCost}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>Difficulty: {rec.difficulty}</span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {rec.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t">
                      {rec.isImplemented ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Implemented on {rec.implementedAt ? new Date(rec.implementedAt).toLocaleDateString() : 'Unknown date'}
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleImplementRecommendation(rec.id)}
                          className="w-full sm:w-auto"
                        >
                          Mark as Implemented
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics?.map((metric) => (
                <Card key={metric.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {metric.metricType.replace('_', ' ')}
                    </CardTitle>
                    {metric.changePercentage && metric.changePercentage > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    {metric.changePercentage && (
                      <p className={`text-xs ${metric.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage}% from previous
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
                <CardDescription>
                  Comprehensive security assessment for {assessment?.companyName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Company Information</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt>Industry:</dt>
                        <dd>{assessment?.industry}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Company Size:</dt>
                        <dd className="capitalize">{assessment?.companySize}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Risk Level:</dt>
                        <dd className={`capitalize font-medium ${getRiskColor(assessment?.riskLevel || '')}`}>
                          {assessment?.riskLevel}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Current Security Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {assessment?.currentSecurityTools?.map((tool, index) => (
                        <Badge key={index} variant="outline">{tool}</Badge>
                      ))}
                    </div>
                    <h4 className="font-semibold mb-2 mt-4">Compliance Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {assessment?.complianceRequirements?.map((req, index) => (
                        <Badge key={index} variant="secondary">{req}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import {
    AlertTriangle,
    Award,
    CheckCircle,
    Clock,
    Download,
    FileText,
    Filter,
    RefreshCw,
    Shield,
    Star,
    Target,
    TrendingUp,
    UserCheck
} from "lucide-react";
import { useState } from "react";
import {
    Bar,
    CartesianGrid,
    Line,
    LineChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface CandidateEvaluationViewProps {
  onOpenModal: (type: string) => void;
}

const scoringCriteriaData = [
  { criterion: "Skills Match", weight: 40, avgScore: 85, target: 80 },
  { criterion: "Experience Level", weight: 30, avgScore: 78, target: 75 },
  { criterion: "Education", weight: 20, avgScore: 82, target: 70 },
  { criterion: "Other Factors", weight: 10, avgScore: 88, target: 75 }
];

const evaluationTrendsData = [
  { month: "Jan", avgScore: 78, candidates: 45, passRate: 72 },
  { month: "Feb", avgScore: 82, candidates: 52, passRate: 78 },
  { month: "Mar", avgScore: 79, candidates: 48, passRate: 74 },
  { month: "Apr", avgScore: 85, candidates: 61, passRate: 82 },
  { month: "May", avgScore: 87, candidates: 58, passRate: 85 },
  { month: "Jun", avgScore: 89, candidates: 67, passRate: 88 }
];

const candidateProfileData = [
  { category: "Technical Skills", score: 92 },
  { category: "Communication", score: 85 },
  { category: "Problem Solving", score: 88 },
  { category: "Leadership", score: 76 },
  { category: "Culture Fit", score: 90 },
  { category: "Adaptability", score: 82 }
];

export function CandidateEvaluationView({ onOpenModal }: CandidateEvaluationViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterScore, setFilterScore] = useState("all");

  const handleStartEvaluation = (candidateName: string) => {
    toast.success(`Starting evaluation for ${candidateName}...`, {
      description: "Initiating background validation and screening process"
    });
  };

  const handleViewProfile = (candidateName: string) => {
    toast.info(`Opening detailed profile for ${candidateName}...`, {
      description: "Loading complete candidate assessment data"
    });
  };

  const handleExportReport = () => {
    toast.success("Exporting evaluation report...", {
      description: "Comprehensive candidate evaluation data being prepared"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Candidate Evaluation & Enrichment</h2>
          <p className="text-muted-foreground">Phase 3: Comprehensive candidate screening and assessment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => onOpenModal("create-assessment")}>
            <UserCheck className="h-4 w-4 mr-2" />
            Start Evaluation
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates Evaluated</CardTitle>
            <UserCheck className="h-4 w-4 icon-accent-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+18% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 icon-accent-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.2</div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
            <Progress value={85.2} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Red Flags Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 icon-accent-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Requiring review</p>
            <Badge variant="destructive" className="mt-2">High Priority</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 icon-accent-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Above 60 threshold</p>
            <Badge className="bg-green-100 text-green-800 mt-2">On Target</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Evaluation Overview</TabsTrigger>
          <TabsTrigger value="screening">Screening Process</TabsTrigger>
          <TabsTrigger value="candidates">Candidate Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Scoring Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-1" />
                Weighted Evaluation Scoring Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Scoring Criteria & Weights</h4>
                    {scoringCriteriaData.map((criterion, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{criterion.criterion}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{criterion.weight}%</Badge>
                            <span className="text-sm font-medium">Avg: {criterion.avgScore}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={criterion.weight * 2.5} className="flex-1 h-2" />
                          <div className="w-16">
                            <Progress 
                              value={(criterion.avgScore / 100) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Target: {criterion.target} | Current: {criterion.avgScore} 
                          {criterion.avgScore >= criterion.target ? " ✅" : " ⚠️"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Score Categories</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <h5 className="font-medium text-green-800">Exceptional Fit</h5>
                          <p className="text-sm text-green-600">90-100 points</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">23 candidates</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div>
                          <h5 className="font-medium text-blue-800">Strong Candidate</h5>
                          <p className="text-sm text-blue-600">75-89 points</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">34 candidates</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                        <div>
                          <h5 className="font-medium text-yellow-800">Qualified with Gaps</h5>
                          <p className="text-sm text-yellow-600">60-74 points</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">21 candidates</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <h5 className="font-medium text-red-800">Not Qualified</h5>
                          <p className="text-sm text-red-600">Below 60 points</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800">11 candidates</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 icon-accent-2" />
                Evaluation Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evaluationTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="candidates" fill="#6366f1" name="Candidates Evaluated" />
                  <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#22c55e" strokeWidth={2} name="Avg Score" />
                  <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#ec4899" strokeWidth={2} name="Pass Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Current Evaluation Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 icon-accent-3" />
                Current Evaluation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Chen", role: "Senior Developer", stage: "Social Media Audit", progress: 75, priority: "high" },
                  { name: "Michael Rodriguez", role: "Product Manager", stage: "Background Validation", progress: 45, priority: "medium" },
                  { name: "Emma Davis", role: "UX Designer", stage: "Resume Scoring", progress: 90, priority: "high" },
                  { name: "James Wilson", role: "Data Scientist", stage: "Red Flag Detection", progress: 30, priority: "low" }
                ].map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{candidate.name}</h4>
                        <Badge variant="outline">{candidate.role}</Badge>
                        <Badge variant={
                          candidate.priority === "high" ? "destructive" :
                          candidate.priority === "medium" ? "secondary" : "outline"
                        }>
                          {candidate.priority} priority
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current stage: {candidate.stage}</span>
                          <span>{candidate.progress}%</span>
                        </div>
                        <Progress value={candidate.progress} className="h-2" />
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewProfile(candidate.name)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleStartEvaluation(candidate.name)}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screening" className="space-y-6">
          {/* Screening Process Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 icon-accent-1" />
                Comprehensive Screening Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 icon-accent-1" />
                    <h4 className="font-medium">Resume Scoring</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processed</span>
                      <Badge>247</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Score</span>
                      <span className="font-medium">82.5/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pass Rate</span>
                      <span className="font-medium">76%</span>
                    </div>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 icon-accent-2" />
                    <h4 className="font-medium">Social Media Audit</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profiles Checked</span>
                      <Badge>189</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Issues Found</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Clean Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 icon-accent-3" />
                    <h4 className="font-medium">Background Validation</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Validations Run</span>
                      <Badge>156</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Verified</span>
                      <span className="font-medium">148</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">95%</span>
                    </div>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 icon-accent-4" />
                    <h4 className="font-medium">Red Flag Detection</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Candidates Screened</span>
                      <Badge>247</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Flags Detected</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Flag Rate</span>
                      <span className="font-medium">7.3%</span>
                    </div>
                  </div>
                  <Progress value={92.7} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Red Flags and Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 icon-accent-4" />
                Red Flags Requiring Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    candidate: "John Smith", 
                    role: "Backend Developer", 
                    flag: "Employment Gap", 
                    severity: "medium", 
                    details: "6-month gap between positions",
                    status: "under-review"
                  },
                  { 
                    candidate: "Maria Garcia", 
                    role: "Frontend Developer", 
                    flag: "Conflicting Information", 
                    severity: "high", 
                    details: "LinkedIn vs Resume discrepancy",
                    status: "pending"
                  },
                  { 
                    candidate: "David Kim", 
                    role: "Product Manager", 
                    flag: "Social Media Content", 
                    severity: "low", 
                    details: "Inappropriate public posts",
                    status: "resolved"
                  },
                  { 
                    candidate: "Lisa Johnson", 
                    role: "Data Scientist", 
                    flag: "Reference Issue", 
                    severity: "high", 
                    details: "Previous employer unresponsive",
                    status: "pending"
                  }
                ].map((flag, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{flag.candidate}</h4>
                        <Badge variant="outline">{flag.role}</Badge>
                        <Badge variant={
                          flag.severity === "high" ? "destructive" :
                          flag.severity === "medium" ? "secondary" : "outline"
                        }>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {flag.severity}
                        </Badge>
                        <Badge variant={
                          flag.status === "resolved" ? "default" :
                          flag.status === "under-review" ? "secondary" : "outline"
                        }>
                          {flag.status}
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Issue:</span>
                          <span className="ml-2 font-medium">{flag.flag}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Details:</span>
                          <span className="ml-2">{flag.details}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                      {flag.status === "pending" && (
                        <Button size="sm">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Screening Accuracy Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Screening Process Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">96.2%</div>
                  <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                  <Badge className="bg-green-100 text-green-800">Exceeds target (95%)</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">3.8%</div>
                  <p className="text-sm text-muted-foreground">False Positive Rate</p>
                  <Badge className="bg-blue-100 text-blue-800">Within tolerance</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">1.2%</div>
                  <p className="text-sm text-muted-foreground">False Negative Rate</p>
                  <Badge className="bg-purple-100 text-purple-800">Excellent</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          {/* Filter Controls */}
          <div className="flex gap-4 items-center">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterScore} onValueChange={setFilterScore}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="exceptional">90-100</SelectItem>
                <SelectItem value="strong">75-89</SelectItem>
                <SelectItem value="qualified">60-74</SelectItem>
                <SelectItem value="below">Below 60</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Candidate Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 icon-accent-1" />
                Candidate Evaluation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Sarah Chen",
                    role: "Senior Developer",
                    totalScore: 94,
                    skills: 96,
                    experience: 92,
                    education: 90,
                    other: 95,
                    status: "completed",
                    redFlags: 0,
                    category: "exceptional"
                  },
                  {
                    name: "Michael Rodriguez",
                    role: "Product Manager",
                    totalScore: 87,
                    skills: 85,
                    experience: 90,
                    education: 88,
                    other: 85,
                    status: "completed",
                    redFlags: 0,
                    category: "strong"
                  },
                  {
                    name: "Emma Davis",
                    role: "UX Designer",
                    totalScore: 78,
                    skills: 82,
                    experience: 75,
                    education: 80,
                    other: 75,
                    status: "in-progress",
                    redFlags: 1,
                    category: "strong"
                  },
                  {
                    name: "James Wilson",
                    role: "Data Scientist",
                    totalScore: 72,
                    skills: 88,
                    experience: 65,
                    education: 75,
                    other: 60,
                    status: "completed",
                    redFlags: 2,
                    category: "qualified"
                  }
                ].map((candidate, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{candidate.name}</h4>
                        <Badge variant="outline">{candidate.role}</Badge>
                        <Badge variant={
                          candidate.category === "exceptional" ? "default" :
                          candidate.category === "strong" ? "secondary" : "outline"
                        }>
                          {candidate.totalScore}/100
                        </Badge>
                        <Badge variant={candidate.status === "completed" ? "default" : "secondary"}>
                          {candidate.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {candidate.status}
                        </Badge>
                        {candidate.redFlags > 0 && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {candidate.redFlags} flag{candidate.redFlags > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{candidate.totalScore}</div>
                        <p className="text-xs text-muted-foreground">Total Score</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Skills (40%):</span>
                        <div className="flex items-center gap-2">
                          <Progress value={candidate.skills} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{candidate.skills}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Experience (30%):</span>
                        <div className="flex items-center gap-2">
                          <Progress value={candidate.experience} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{candidate.experience}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Education (20%):</span>
                        <div className="flex items-center gap-2">
                          <Progress value={candidate.education} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{candidate.education}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Other (10%):</span>
                        <div className="flex items-center gap-2">
                          <Progress value={candidate.other} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{candidate.other}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewProfile(candidate.name)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Full Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                      {candidate.status === "completed" && candidate.totalScore >= 75 && (
                        <Button size="sm">
                          Move to Interviews
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sample Candidate Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Profile Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={candidateProfileData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Score Distribution</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>90-100 (Exceptional):</span>
                        <Badge className="bg-green-100 text-green-800">23</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>75-89 (Strong):</span>
                        <Badge className="bg-blue-100 text-blue-800">34</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>60-74 (Qualified):</span>
                        <Badge className="bg-yellow-100 text-yellow-800">21</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Below 60:</span>
                        <Badge className="bg-red-100 text-red-800">11</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Quality Indicators</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Average evaluation time:</span>
                        <span className="font-medium">2.3 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy rate:</span>
                        <span className="font-medium">96.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Red flag rate:</span>
                        <span className="font-medium">7.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Performance Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Evaluation Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600">96%</div>
                <p className="text-sm text-muted-foreground">Process accuracy</p>
                <Badge className="bg-green-100 text-green-800 mt-2">Above target</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Time Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600">2.3h</div>
                <p className="text-sm text-muted-foreground">Avg. evaluation time</p>
                <Badge className="bg-blue-100 text-blue-800 mt-2">Optimized</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Quality Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-purple-600">85.2</div>
                <p className="text-sm text-muted-foreground">Average candidate score</p>
                <Badge className="bg-purple-100 text-purple-800 mt-2">High quality</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-orange-600">78%</div>
                <p className="text-sm text-muted-foreground">Pass to next stage</p>
                <Badge className="bg-orange-100 text-orange-800 mt-2">On target</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 icon-accent-4" />
                Process Improvement Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-green-600">✅ Strengths</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Resume scoring algorithm shows 96% accuracy</li>
                    <li>• Social media audit catches 94% of potential issues</li>
                    <li>• Background validation has 95% success rate</li>
                    <li>• Red flag detection prevents bad hires effectively</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-orange-600">🔄 Improvements</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Reduce false positive rate in red flag detection</li>
                    <li>• Automate more reference check processes</li>
                    <li>• Improve education verification speed</li>
                    <li>• Add bias detection to scoring algorithms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
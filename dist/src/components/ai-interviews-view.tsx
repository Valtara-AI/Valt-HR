import {
    Award,
    Brain,
    Clock,
    Download,
    FileText,
    MessageSquare,
    Mic,
    Phone,
    PlayCircle,
    Settings,
    Star,
    StopCircle,
    Target,
    TrendingUp,
    Volume2,
    Zap
} from "lucide-react";
import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
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
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AIInterviewsViewProps {
  onOpenModal: (type: string) => void;
}

const interviewPerformanceData = [
  { month: "Jan", interviews: 45, avgScore: 4.2, duration: 18 },
  { month: "Feb", interviews: 52, avgScore: 4.4, duration: 17 },
  { month: "Mar", interviews: 48, avgScore: 4.6, duration: 19 },
  { month: "Apr", interviews: 61, avgScore: 4.5, duration: 16 },
  { month: "May", interviews: 58, avgScore: 4.7, duration: 15 },
  { month: "Jun", interviews: 67, avgScore: 4.8, duration: 14 }
];

const speechAnalysisData = [
  { name: "Technical Accuracy", value: 94 },
  { name: "Communication Clarity", value: 89 },
  { name: "Confidence Level", value: 87 },
  { name: "Response Relevance", value: 92 },
  { name: "Problem Solving", value: 88 },
  { name: "Cultural Fit", value: 85 }
];

const sentimentDistributionData = [
  { name: "Positive", value: 45, color: "#22c55e" },
  { name: "Confident", value: 30, color: "#6366f1" },
  { name: "Neutral", value: 20, color: "#a855f7" },
  { name: "Nervous", value: 5, color: "#facc15" }
];

const questionTypeData = [
  { type: "Technical", asked: 156, avgResponse: 45, satisfaction: 4.7 },
  { type: "Behavioral", asked: 124, avgResponse: 38, satisfaction: 4.5 },
  { type: "Problem Solving", asked: 89, avgResponse: 52, satisfaction: 4.8 },
  { type: "Culture Fit", asked: 67, avgResponse: 31, satisfaction: 4.6 }
];

export function AIInterviewsView({ onOpenModal }: AIInterviewsViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLiveDemo, setIsLiveDemo] = useState(false);

  // currently unused, keep for future integration
  const _handleStartInterview = (candidateName: string) => {
    toast.success(`Starting AI interview with ${candidateName}...`, {
      description: "AI interviewer is initializing and preparing questions"
    });
  };

  const handleViewTranscript = (candidateName: string) => {
    toast.info(`Opening interview transcript for ${candidateName}...`, {
      description: "Loading complete conversation analysis"
    });
  };

  const handleStartDemo = () => {
    setIsLiveDemo(true);
    toast.info("Starting AI interview demonstration...", {
      description: "Experience our AI interviewer in action"
    });
  };

  const handleStopDemo = () => {
    setIsLiveDemo(false);
    toast.success("Demo session ended", {
      description: "Interview demonstration completed"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">AI-Powered Phone Interviews</h2>
          <p className="text-muted-foreground">Phase 5: Automated intelligent interview system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleStartDemo}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Demo AI Interview
          </Button>
          <Button onClick={() => onOpenModal("schedule-interview")}>
            <Phone className="h-4 w-4 mr-2" />
            Schedule AI Interview
          </Button>
        </div>
      </div>

      {/* Live Demo Banner */}
      {isLiveDemo && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">AI Interview Demo Active</span>
              <Badge variant="destructive">LIVE</Badge>
            </div>
            <Button size="sm" variant="outline" onClick={handleStopDemo}>
              <StopCircle className="h-4 w-4 mr-1" />
              End Demo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interviews Today</CardTitle>
            <Phone className="h-4 w-4 icon-accent-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 in progress, 5 completed</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+23% vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Interview Quality</CardTitle>
            <Star className="h-4 w-4 icon-accent-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">Candidate satisfaction</p>
            <Progress value={96} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Speech Recognition</CardTitle>
            <Mic className="h-4 w-4 icon-accent-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <p className="text-xs text-muted-foreground">Accuracy rate</p>
            <Badge className="bg-green-100 text-green-800 mt-2">Excellent</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 icon-accent-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 min</div>
            <p className="text-xs text-muted-foreground">Per interview</p>
            <Badge className="bg-blue-100 text-blue-800 mt-2">Optimal</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Interview Overview</TabsTrigger>
          <TabsTrigger value="analysis">Speech Analysis</TabsTrigger>
          <TabsTrigger value="results">Interview Results</TabsTrigger>
          <TabsTrigger value="settings">AI Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Interview Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 icon-accent-1" />
                AI Interview Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={interviewPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="interviews" fill="#6366f1" name="Interviews Conducted" />
                  <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#22c55e" strokeWidth={2} name="Avg Quality Score" />
                  <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#ec4899" strokeWidth={2} name="Avg Duration (min)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Active AI Interviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 icon-accent-2" />
                Currently Active AI Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    candidate: "Sarah Chen",
                    role: "Senior Developer",
                    startTime: "10:23 AM",
                    duration: "12 min",
                    status: "in-progress",
                    currentTopic: "Technical Architecture",
                    responseQuality: 87,
                    sentimentScore: "Confident"
                  },
                  {
                    candidate: "Michael Rodriguez",
                    role: "Product Manager",
                    startTime: "10:45 AM",
                    duration: "8 min",
                    status: "in-progress",
                    currentTopic: "Product Strategy",
                    responseQuality: 92,
                    sentimentScore: "Enthusiastic"
                  },
                  {
                    candidate: "Emma Davis",
                    role: "UX Designer",
                    startTime: "11:15 AM",
                    duration: "0 min",
                    status: "connecting",
                    currentTopic: "Initializing",
                    responseQuality: 0,
                    sentimentScore: "N/A"
                  }
                ].map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {interview.status === "in-progress" && (
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                          {interview.status === "connecting" && (
                            <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <h4 className="font-medium">{interview.candidate}</h4>
                        <Badge variant="outline">{interview.role}</Badge>
                        <Badge variant={interview.status === "in-progress" ? "default" : "secondary"}>
                          {interview.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Started:</span>
                          <span className="ml-2 font-medium">{interview.startTime}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 font-medium">{interview.duration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Topic:</span>
                          <span className="ml-2 font-medium">{interview.currentTopic}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="ml-2 font-medium">{interview.responseQuality > 0 ? `${interview.responseQuality}%` : "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {interview.status === "in-progress" && (
                        <Button size="sm" variant="outline">
                          <Volume2 className="h-3 w-3 mr-1" />
                          Monitor
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Structured Question Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 icon-accent-3" />
                Structured Question Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questionTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="asked" fill="#6366f1" name="Questions Asked" />
                  <Bar yAxisId="left" dataKey="avgResponse" fill="#ec4899" name="Avg Response Time (s)" />
                  <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#22c55e" strokeWidth={2} name="Satisfaction Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Today's Completed Interviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 icon-accent-4" />
                Today's Completed AI Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { candidate: "James Wilson", role: "Data Scientist", score: 94, duration: "16 min", sentiment: "Positive" },
                  { candidate: "Lisa Thompson", role: "Backend Dev", score: 87, duration: "19 min", sentiment: "Confident" },
                  { candidate: "Kevin Lee", role: "DevOps Engineer", score: 91, duration: "15 min", sentiment: "Enthusiastic" },
                  { candidate: "Sophie Martin", role: "Frontend Dev", score: 83, duration: "22 min", sentiment: "Nervous" }
                ].map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{result.candidate}</h4>
                        <Badge variant="outline">{result.role}</Badge>
                        <Badge className={
                          result.score >= 90 ? "bg-green-100 text-green-800" :
                          result.score >= 80 ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          Score: {result.score}/100
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 font-medium">{result.duration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sentiment:</span>
                          <span className="ml-2 font-medium">{result.sentiment}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewTranscript(result.candidate)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Transcript
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Speech Analysis Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 icon-accent-1" />
                Real-time Speech Analysis Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={speechAnalysisData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Analysis Capabilities</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Speech Recognition Accuracy</span>
                      <div className="flex items-center gap-2">
                        <Progress value={94.8} className="w-20 h-2" />
                        <span className="text-sm font-medium">94.8%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Response Time</span>
                      <div className="flex items-center gap-2">
                        <Progress value={90} className="w-20 h-2" />
                        <span className="text-sm font-medium">&lt; 2s</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sentiment Analysis</span>
                      <div className="flex items-center gap-2">
                        <Progress value={91.2} className="w-20 h-2" />
                        <span className="text-sm font-medium">91.2%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Language Support</span>
                      <div className="flex items-center gap-2">
                        <Badge>25+ dialects</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 icon-accent-2" />
                  Candidate Sentiment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={sentimentDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sentimentDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Clarity Score</span>
                      <span className="text-sm font-medium">89.3%</span>
                    </div>
                    <Progress value={89.3} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Confidence Level</span>
                      <span className="text-sm font-medium">87.1%</span>
                    </div>
                    <Progress value={87.1} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Response Relevance</span>
                      <span className="text-sm font-medium">92.4%</span>
                    </div>
                    <Progress value={92.4} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Technical Accuracy</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Analysis Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 icon-accent-3" />
                Real-time Analysis Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Speech Processing</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time speech-to-text conversion</li>
                    <li>• Multi-language accent recognition</li>
                    <li>• Background noise filtering</li>
                    <li>• Speaking pace analysis</li>
                    <li>• Pronunciation assessment</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Sentiment & Emotion</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time sentiment detection</li>
                    <li>• Confidence level measurement</li>
                    <li>• Stress pattern identification</li>
                    <li>• Enthusiasm tracking</li>
                    <li>• Nervousness indicators</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Content Analysis</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Technical keyword extraction</li>
                    <li>• Response completeness scoring</li>
                    <li>• Problem-solving approach</li>
                    <li>• Communication clarity</li>
                    <li>• Cultural fit indicators</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {/* Interview Quality Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 icon-accent-1" />
                Interview Quality & Success Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">4.8/5</div>
                  <p className="text-sm text-muted-foreground">Candidate Satisfaction</p>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">94.8%</div>
                  <p className="text-sm text-muted-foreground">Speech Recognition</p>
                  <Badge className="bg-blue-100 text-blue-800">Industry Leading</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">18min</div>
                  <p className="text-sm text-muted-foreground">Average Duration</p>
                  <Badge className="bg-purple-100 text-purple-800">Optimal</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">91.2%</div>
                  <p className="text-sm text-muted-foreground">Interview Success Rate</p>
                  <Badge className="bg-orange-100 text-orange-800">High Performance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Interview Results */}
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Interview Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    candidate: "Sarah Chen",
                    role: "Senior Developer",
                    overallScore: 94,
                    technical: 96,
                    communication: 92,
                    cultural: 90,
                    sentiment: "Confident",
                    duration: "16 min",
                    keyStrengths: ["Strong technical background", "Clear communication", "Problem-solving approach"],
                    areas: ["Could improve on system design questions"]
                  },
                  {
                    candidate: "Michael Rodriguez",
                    role: "Product Manager",
                    overallScore: 87,
                    technical: 85,
                    communication: 90,
                    cultural: 88,
                    sentiment: "Enthusiastic",
                    duration: "22 min",
                    keyStrengths: ["Excellent communication", "Strategic thinking", "Customer focus"],
                    areas: ["Technical depth in some areas"]
                  },
                  {
                    candidate: "Emma Davis",
                    role: "UX Designer",
                    overallScore: 91,
                    technical: 88,
                    communication: 95,
                    cultural: 92,
                    sentiment: "Positive",
                    duration: "19 min",
                    keyStrengths: ["Design thinking", "User empathy", "Creative solutions"],
                    areas: ["Could elaborate more on process"]
                  }
                ].map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{result.candidate}</h4>
                        <Badge variant="outline">{result.role}</Badge>
                        <Badge className={
                          result.overallScore >= 90 ? "bg-green-100 text-green-800" :
                          result.overallScore >= 80 ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          Overall: {result.overallScore}/100
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{result.duration}</div>
                        <div className="text-xs text-muted-foreground">{result.sentiment}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Technical:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={result.technical} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{result.technical}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Communication:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={result.communication} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{result.communication}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Cultural Fit:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={result.cultural} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{result.cultural}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-600 mb-2">Key Strengths:</h5>
                        <ul className="space-y-1">
                          {result.keyStrengths.map((strength, idx) => (
                            <li key={idx} className="text-xs">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-orange-600 mb-2">Improvement Areas:</h5>
                        <ul className="space-y-1">
                          {result.areas.map((area, idx) => (
                            <li key={idx} className="text-xs">• {area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewTranscript(result.candidate)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Full Transcript
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Export Analysis
                      </Button>
                      {result.overallScore >= 85 && (
                        <Button size="sm">
                          Schedule Human Interview
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* AI Configuration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 icon-accent-1" />
                AI Interviewer Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Speech Recognition Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Real-time transcription</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Multi-language support</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Accent adaptation</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Background noise filtering</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Analysis Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Sentiment analysis</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Confidence scoring</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Technical keyword extraction</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Response time tracking</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Generation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-2" />
                Adaptive Question Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Question Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Technical skills questions</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Behavioral questions</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Problem-solving scenarios</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Culture fit questions</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Adaptive Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Dynamic follow-up questions</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Difficulty adjustment</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Context-aware questioning</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Role-specific customization</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>AI Performance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <p className="text-sm text-muted-foreground">Adaptive Questions</p>
                  <Badge className="bg-green-100 text-green-800">Comprehensive</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">Advanced</div>
                  <p className="text-sm text-muted-foreground">Context Awareness</p>
                  <Badge className="bg-blue-100 text-blue-800">AI-Powered</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">AI-driven</div>
                  <p className="text-sm text-muted-foreground">Follow-up Logic</p>
                  <Badge className="bg-purple-100 text-purple-800">Intelligent</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">High</div>
                  <p className="text-sm text-muted-foreground">Role Specificity</p>
                  <Badge className="bg-orange-100 text-orange-800">Customized</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
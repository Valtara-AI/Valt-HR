import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    FileText,
    MessageSquare,
    Phone,
    PlayCircle,
    Star,
    TrendingUp,
    Users,
    Video
} from "lucide-react";
import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface InterviewsViewProps {
  onOpenModal: (type: string) => void;
}

const interviewTrendsData = [
  { month: "Jan", aiInterviews: 45, humanInterviews: 23, quality: 4.2 },
  { month: "Feb", aiInterviews: 52, humanInterviews: 28, quality: 4.4 },
  { month: "Mar", aiInterviews: 48, humanInterviews: 31, quality: 4.6 },
  { month: "Apr", aiInterviews: 61, humanInterviews: 29, quality: 4.5 },
  { month: "May", aiInterviews: 58, humanInterviews: 35, quality: 4.7 },
  { month: "Jun", aiInterviews: 67, humanInterviews: 33, quality: 4.8 }
];

const interviewTypeData = [
  { type: "Technical", aiConducted: 45, humanConducted: 12, avgScore: 4.6 },
  { type: "Behavioral", aiConducted: 38, humanConducted: 18, avgScore: 4.8 },
  { type: "Cultural Fit", aiConducted: 29, humanConducted: 25, avgScore: 4.5 },
  { type: "Leadership", aiConducted: 15, humanConducted: 20, avgScore: 4.7 }
];

export function InterviewsView({ onOpenModal }: InterviewsViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [_interviewFilter, _setInterviewFilter] = useState("all");

  const handleJoinMeeting = (candidateName: string) => {
    toast.success(`Joining video call with ${candidateName}...`, {
      description: "Opening video conferencing platform"
    });
  };

  const handleStartAIInterview = (candidateName: string) => {
    toast.info(`Starting AI interview with ${candidateName}...`, {
      description: "AI interviewer is initializing questions"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Interview Management</h2>
          <p className="text-muted-foreground">Phase 5 & 7: AI-conducted and human interviews</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Opening calendar integration...")}>
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button onClick={() => onOpenModal("schedule-interview")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Interview Overview</TabsTrigger>
          <TabsTrigger value="ai-interviews">AI Interviews</TabsTrigger>
          <TabsTrigger value="human-interviews">Human Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Interview Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Interviews Today</CardTitle>
                <Phone className="h-4 w-4 icon-accent-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">3 in progress</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+23% vs yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Human Interviews</CardTitle>
                <Video className="h-4 w-4 icon-accent-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">2 pending feedback</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs">Avg rating: 4.8/5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interview Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 icon-accent-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">Pass to next stage</p>
                <Progress value={78} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Quality Score</CardTitle>
                <Star className="h-4 w-4 icon-accent-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.6/5</div>
                <p className="text-xs text-muted-foreground">AI interview quality</p>
                <p className="text-xs text-muted-foreground">Human: 4.8/5</p>
              </CardContent>
            </Card>
          </div>

          {/* Interview Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 icon-accent-1" />
                Interview Volume & Quality Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={interviewTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="aiInterviews" fill="#6366f1" name="AI Interviews" />
                  <Bar yAxisId="left" dataKey="humanInterviews" fill="#ec4899" name="Human Interviews" />
                  <Line yAxisId="right" type="monotone" dataKey="quality" stroke="#22c55e" strokeWidth={2} name="Quality Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Today's Interview Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 icon-accent-2" />
                Today's Interview Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    candidate: "Sarah Chen", 
                    role: "Senior Developer", 
                    time: "10:00 AM", 
                    type: "AI Phone", 
                    interviewer: "AI Assistant",
                    status: "completed",
                    score: "94/100"
                  },
                  { 
                    candidate: "Michael Rodriguez", 
                    role: "Product Manager", 
                    time: "2:00 PM", 
                    type: "Human Video", 
                    interviewer: "Jane Smith",
                    status: "in-progress",
                    score: "TBD"
                  },
                  { 
                    candidate: "Emma Davis", 
                    role: "UX Designer", 
                    time: "4:30 PM", 
                    type: "AI Phone", 
                    interviewer: "AI Assistant",
                    status: "scheduled",
                    score: "TBD"
                  },
                  { 
                    candidate: "James Wilson", 
                    role: "Data Scientist", 
                    time: "Tomorrow, 10:00 AM", 
                    type: "Human Video", 
                    interviewer: "Bob Anderson",
                    status: "scheduled",
                    score: "TBD"
                  }
                ].map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{interview.candidate}</h4>
                        <Badge variant="outline">{interview.role}</Badge>
                        <Badge variant={interview.type.includes("AI") ? "default" : "secondary"}>
                          {interview.type.includes("AI") ? (
                            <Phone className="h-3 w-3 mr-1" />
                          ) : (
                            <Video className="h-3 w-3 mr-1" />
                          )}
                          {interview.type}
                        </Badge>
                        <Badge variant={
                          interview.status === "completed" ? "default" : 
                          interview.status === "in-progress" ? "secondary" : "outline"
                        }>
                          {interview.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {interview.status === "in-progress" && <PlayCircle className="h-3 w-3 mr-1" />}
                          {interview.status === "scheduled" && <Clock className="h-3 w-3 mr-1" />}
                          {interview.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2 font-medium">{interview.time}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Interviewer:</span>
                          <span className="ml-2 font-medium">{interview.interviewer}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Score:</span>
                          <span className="ml-2 font-medium">{interview.score}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {interview.status === "scheduled" && (
                        <Button 
                          size="sm" 
                          onClick={() => interview.type.includes("AI") 
                            ? handleStartAIInterview(interview.candidate)
                            : handleJoinMeeting(interview.candidate)
                          }
                        >
                          {interview.type.includes("AI") ? "Start AI Interview" : "Join Meeting"}
                        </Button>
                      )}
                      {interview.status === "in-progress" && (
                        <Button size="sm" onClick={() => handleJoinMeeting(interview.candidate)}>
                          Join Meeting
                        </Button>
                      )}
                      {interview.status === "completed" && (
                        <Button size="sm" variant="outline">
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-interviews" className="space-y-6">
          {/* AI Interview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 icon-accent-1" />
                  AI Interview Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Accuracy Rate</span>
                    <span className="font-medium">96.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Duration</span>
                    <span className="font-medium">18 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Question Relevance</span>
                    <span className="font-medium">9.2/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Candidate Satisfaction</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Speech Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Recognition Accuracy</span>
                    <span className="font-medium">94.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span className="font-medium">&lt; 2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sentiment Analysis</span>
                    <span className="font-medium">91.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language Support</span>
                    <span className="font-medium">25+ dialects</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Question Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Adaptive Questions</span>
                    <span className="font-medium">500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Context Awareness</span>
                    <span className="font-medium">Advanced</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Follow-up Logic</span>
                    <span className="font-medium">AI-driven</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role Specificity</span>
                    <span className="font-medium">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Interview Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 icon-accent-2" />
                Interview Type Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interviewTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="aiConducted" fill="#6366f1" name="AI Conducted" />
                  <Bar yAxisId="left" dataKey="humanConducted" fill="#ec4899" name="Human Conducted" />
                  <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#22c55e" strokeWidth={2} name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent AI Interviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Interview Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { candidate: "Sarah Chen", role: "Senior Developer", duration: "16 min", score: 94, sentiment: "Positive", clarity: 98 },
                  { candidate: "Mark Johnson", role: "Frontend Dev", duration: "22 min", score: 87, sentiment: "Confident", clarity: 92 },
                  { candidate: "Lisa Wang", role: "Backend Dev", duration: "19 min", score: 91, sentiment: "Enthusiastic", clarity: 96 },
                  { candidate: "David Brown", role: "Full Stack", duration: "25 min", score: 83, sentiment: "Nervous", clarity: 89 }
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
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 font-medium">{result.duration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sentiment:</span>
                          <span className="ml-2 font-medium">{result.sentiment}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clarity:</span>
                          <span className="ml-2 font-medium">{result.clarity}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
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

        <TabsContent value="human-interviews" className="space-y-6">
          {/* Human Interview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 icon-accent-1" />
                  Interviewer Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Active Interviewers</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Rating</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consistency Score</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interview Quality</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interview Logistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>On-time Rate</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Duration</span>
                    <span className="font-medium">45 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No-show Rate</span>
                    <span className="font-medium">3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rescheduling Rate</span>
                    <span className="font-medium">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Response Time</span>
                    <span className="font-medium">2.3 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Detail Score</span>
                    <span className="font-medium">4.7/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actionability</span>
                    <span className="font-medium">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interviewer Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 icon-accent-2" />
                Top Performing Interviewers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Jane Smith", role: "Senior Manager", interviews: 24, rating: 4.9, onTime: 100, feedback: "Excellent" },
                  { name: "Bob Anderson", role: "Tech Lead", interviews: 18, rating: 4.8, onTime: 98, feedback: "Detailed" },
                  { name: "Carol Wilson", role: "Director", interviews: 15, rating: 4.7, onTime: 96, feedback: "Constructive" },
                  { name: "Mike Davis", role: "Senior Dev", interviews: 21, rating: 4.6, onTime: 94, feedback: "Thorough" }
                ].map((interviewer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                        <h4 className="font-medium">{interviewer.name}</h4>
                        <Badge variant="outline">{interviewer.role}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{interviewer.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Interviews:</span>
                          <span className="ml-2 font-medium">{interviewer.interviews}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">On-time:</span>
                          <span className="ml-2 font-medium">{interviewer.onTime}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Feedback:</span>
                          <span className="ml-2 font-medium">{interviewer.feedback}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 icon-accent-3" />
                Pending Interview Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { candidate: "Michael Rodriguez", interviewer: "Jane Smith", date: "Today", overdue: false },
                  { candidate: "David Kim", interviewer: "Bob Anderson", date: "Yesterday", overdue: true },
                  { candidate: "Amy Chen", interviewer: "Carol Wilson", date: "2 days ago", overdue: true }
                ].map((pending, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{pending.candidate}</h4>
                      <p className="text-sm text-muted-foreground">
                        Interviewed by {pending.interviewer} • {pending.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {pending.overdue && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
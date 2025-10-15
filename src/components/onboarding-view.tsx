import {
    AlertTriangle,
    Award,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    FileCheck,
    Mail,
    Phone,
    Settings,
    Target,
    TrendingUp,
    UserPlus,
    Users
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

interface OnboardingViewProps {
  onOpenModal: (type: string) => void;
}

const onboardingProgressData = [
  { month: "Jan", completed: 12, started: 15, avgTime: 4.2 },
  { month: "Feb", completed: 18, started: 20, avgTime: 3.8 },
  { month: "Mar", completed: 15, started: 18, avgTime: 4.1 },
  { month: "Apr", completed: 22, started: 25, avgTime: 3.9 },
  { month: "May", completed: 19, started: 22, avgTime: 3.6 },
  { month: "Jun", completed: 24, started: 26, avgTime: 3.4 }
];

const onboardingStagesData = [
  { name: "Document Collection", value: 25, color: "#6366f1" },
  { name: "System Access", value: 20, color: "#ec4899" },
  { name: "Training Modules", value: 35, color: "#a855f7" },
  { name: "Buddy Program", value: 20, color: "#22c55e" }
];

const checkInData = [
  { period: "30 Days", satisfaction: 4.3, retention: 95, engagement: 87 },
  { period: "60 Days", satisfaction: 4.1, retention: 92, engagement: 84 },
  { period: "90 Days", satisfaction: 4.4, retention: 89, engagement: 88 }
];

export function OnboardingView({ onOpenModal }: OnboardingViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const handleStartOnboarding = (newHire: string) => {
    toast.success(`Starting onboarding for ${newHire}...`, {
      description: "Onboarding workflow initiated"
    });
  };

  const handleSendDocuments = (newHire: string) => {
    toast.success(`Document collection sent to ${newHire}`, {
      description: "Email with required documents and instructions sent"
    });
  };

  const handleScheduleCheckIn = (newHire: string, period: string) => {
    toast.success(`${period} check-in scheduled for ${newHire}`, {
      description: "Calendar invitation sent to manager and new hire"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Onboarding Workflow</h2>
          <p className="text-muted-foreground">New hire integration and employee development process</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Opening onboarding templates...")}>
            <Settings className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => onOpenModal("start-onboarding")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Start Onboarding
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Onboardings</CardTitle>
            <UserPlus className="h-4 w-4 icon-accent-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 this week, 5 next week</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+25% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 icon-accent-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Complete</CardTitle>
            <Clock className="h-4 w-4 icon-accent-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.4</div>
            <p className="text-xs text-muted-foreground">days (target: 4 days)</p>
            <Badge className="bg-green-100 text-green-800 mt-2">On Track</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Award className="h-4 w-4 icon-accent-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5</div>
            <p className="text-xs text-muted-foreground">New hire feedback</p>
            <Badge className="bg-green-100 text-green-800 mt-2">Excellent</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Onboardings</TabsTrigger>
          <TabsTrigger value="checkins">Check-ins</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Onboarding Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-1" />
                Onboarding Pipeline Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 icon-accent-1" />
                    <h4 className="font-medium">Document Collection</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <Badge variant="secondary">7</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <Badge>15</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Time</span>
                      <span className="font-medium">2.3 days</span>
                    </div>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="text-xs text-muted-foreground">68% completion rate</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 icon-accent-2" />
                    <h4 className="font-medium">System Access</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Provisioning</span>
                      <Badge variant="secondary">4</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Complete</span>
                      <Badge>18</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Time</span>
                      <span className="font-medium">1.1 days</span>
                    </div>
                  </div>
                  <Progress value={82} className="h-2" />
                  <p className="text-xs text-muted-foreground">82% completion rate</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 icon-accent-3" />
                    <h4 className="font-medium">Training Schedule</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>In Progress</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <Badge>12</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Score</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </div>
                  <Progress value={60} className="h-2" />
                  <p className="text-xs text-muted-foreground">60% completion rate</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 icon-accent-4" />
                    <h4 className="font-medium">Buddy Assignment</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Matched</span>
                      <Badge>22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active</span>
                      <Badge variant="secondary">18</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Satisfaction</span>
                      <span className="font-medium">4.7/5</span>
                    </div>
                  </div>
                  <Progress value={91} className="h-2" />
                  <p className="text-xs text-muted-foreground">91% match success</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 icon-accent-2" />
                Onboarding Progress Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={onboardingProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="started" fill="#6366f1" name="Started" />
                  <Bar yAxisId="left" dataKey="completed" fill="#22c55e" name="Completed" />
                  <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#ec4899" strokeWidth={2} name="Avg Time (days)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stage Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Stage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={onboardingStagesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {onboardingStagesData.map((entry, index) => (
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
                <CardTitle>Upcoming Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Chen", milestone: "30-day check-in", date: "Tomorrow", status: "scheduled" },
                    { name: "Mike Johnson", milestone: "Training completion", date: "Friday", status: "pending" },
                    { name: "Lisa Wang", milestone: "60-day review", date: "Next week", status: "scheduled" },
                    { name: "David Kim", milestone: "Buddy program end", date: "2 weeks", status: "upcoming" }
                  ].map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{milestone.name}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.milestone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{milestone.date}</p>
                        <Badge variant={milestone.status === "scheduled" ? "default" : "outline"}>
                          {milestone.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {/* Active Onboarding Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 icon-accent-1" />
                Active Onboarding Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Sarah Chen",
                    role: "Senior Developer",
                    startDate: "June 15, 2024",
                    progress: 75,
                    currentStage: "Training Modules",
                    buddy: "Mike Johnson",
                    documentsComplete: true,
                    accessProvisioned: true
                  },
                  {
                    name: "Michael Rodriguez",
                    role: "Product Manager",
                    startDate: "June 18, 2024",
                    progress: 45,
                    currentStage: "System Access",
                    buddy: "Jane Smith",
                    documentsComplete: true,
                    accessProvisioned: false
                  },
                  {
                    name: "Emma Davis",
                    role: "UX Designer",
                    startDate: "June 22, 2024",
                    progress: 30,
                    currentStage: "Document Collection",
                    buddy: "Not assigned",
                    documentsComplete: false,
                    accessProvisioned: false
                  },
                  {
                    name: "James Wilson",
                    role: "Data Scientist",
                    startDate: "June 25, 2024",
                    progress: 15,
                    currentStage: "Document Collection",
                    buddy: "Lisa Thompson",
                    documentsComplete: false,
                    accessProvisioned: false
                  }
                ].map((onboarding, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{onboarding.name}</h4>
                        <p className="text-sm text-muted-foreground">{onboarding.role} • Started {onboarding.startDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{onboarding.progress}% Complete</div>
                        <Progress value={onboarding.progress} className="w-24 mt-1" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Current Stage:</span>
                        <p className="font-medium">{onboarding.currentStage}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Buddy:</span>
                        <p className="font-medium">{onboarding.buddy}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Documents:</span>
                        <div className="flex items-center gap-1">
                          {onboarding.documentsComplete ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-sm">{onboarding.documentsComplete ? "Complete" : "Pending"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">System Access:</span>
                        <div className="flex items-center gap-1">
                          {onboarding.accessProvisioned ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-sm">{onboarding.accessProvisioned ? "Provisioned" : "Pending"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSendDocuments(onboarding.name)}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Send Documents
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleScheduleCheckIn(onboarding.name, "30-day")}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule Check-in
                      </Button>
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Collection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 icon-accent-2" />
                Document Collection Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Required Documents</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tax Forms (W-4, State)</span>
                      <Badge className="bg-green-100 text-green-800">18/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Direct Deposit Info</span>
                      <Badge className="bg-green-100 text-green-800">20/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Emergency Contacts</span>
                      <Badge className="bg-yellow-100 text-yellow-800">15/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>I-9 Verification</span>
                      <Badge className="bg-green-100 text-green-800">22/22</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Benefits Enrollment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health Insurance</span>
                      <Badge className="bg-green-100 text-green-800">19/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Dental/Vision</span>
                      <Badge className="bg-blue-100 text-blue-800">17/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>401(k) Setup</span>
                      <Badge className="bg-yellow-100 text-yellow-800">14/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Life Insurance</span>
                      <Badge className="bg-green-100 text-green-800">21/22</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Policy Acknowledgments</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Employee Handbook</span>
                      <Badge className="bg-green-100 text-green-800">22/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Code of Conduct</span>
                      <Badge className="bg-green-100 text-green-800">21/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Security Policies</span>
                      <Badge className="bg-blue-100 text-blue-800">18/22</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GDPR/Privacy</span>
                      <Badge className="bg-yellow-100 text-yellow-800">16/22</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkins" className="space-y-6">
          {/* Check-in Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 icon-accent-1" />
                30/60/90-Day Check-in Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Chen", type: "30-day", date: "Tomorrow", manager: "John Smith", status: "scheduled" },
                  { name: "Mike Johnson", type: "60-day", date: "Friday", manager: "Jane Doe", status: "scheduled" },
                  { name: "Lisa Wang", type: "90-day", date: "Next Monday", manager: "Bob Wilson", status: "pending" },
                  { name: "David Kim", type: "30-day", date: "Next Wednesday", manager: "Alice Brown", status: "overdue" },
                  { name: "Amy Chen", type: "60-day", date: "Next Friday", manager: "Tom Davis", status: "scheduled" }
                ].map((checkin, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{checkin.name}</h4>
                        <Badge variant={
                          checkin.type === "30-day" ? "default" :
                          checkin.type === "60-day" ? "secondary" : "outline"
                        }>
                          {checkin.type} Check-in
                        </Badge>
                        <Badge variant={
                          checkin.status === "scheduled" ? "default" :
                          checkin.status === "overdue" ? "destructive" : "outline"
                        }>
                          {checkin.status === "overdue" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {checkin.status === "scheduled" && <Calendar className="h-3 w-3 mr-1" />}
                          {checkin.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {checkin.date} with {checkin.manager}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleScheduleCheckIn(checkin.name, checkin.type)}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {checkin.status === "scheduled" ? "Reschedule" : "Schedule"}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Check-in Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Check-in Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={checkInData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="right" dataKey="retention" fill="#22c55e" name="Retention %" />
                  <Bar yAxisId="right" dataKey="engagement" fill="#6366f1" name="Engagement %" />
                  <Line yAxisId="left" type="monotone" dataKey="satisfaction" stroke="#ec4899" strokeWidth={2} name="Satisfaction" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feedback Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Check-in Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Chen", period: "30-day", satisfaction: 4.8, feedback: "Great experience, very supportive team" },
                    { name: "Mike Johnson", period: "60-day", satisfaction: 4.2, feedback: "Need more clarity on project expectations" },
                    { name: "Lisa Wang", period: "90-day", satisfaction: 4.9, feedback: "Love the company culture and growth opportunities" }
                  ].map((feedback, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{feedback.name}</h4>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{feedback.satisfaction}/5</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">"{feedback.feedback}"</p>
                      <Badge variant="outline">{feedback.period}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Items & Follow-ups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Schedule additional training for Mike Johnson", priority: "high", due: "This week" },
                    { action: "Connect Lisa Wang with career development team", priority: "medium", due: "Next week" },
                    { action: "Follow up on Sarah Chen's project assignment", priority: "low", due: "End of month" },
                    { action: "Review onboarding process feedback", priority: "medium", due: "This Friday" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">Due: {item.due}</p>
                      </div>
                      <Badge variant={
                        item.priority === "high" ? "destructive" :
                        item.priority === "medium" ? "secondary" : "outline"
                      }>
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Comprehensive Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Overall Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600">94%</div>
                <p className="text-sm text-muted-foreground">Successful onboardings</p>
                <Badge className="bg-green-100 text-green-800 mt-2">Exceeds target (90%)</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Time Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600">3.4</div>
                <p className="text-sm text-muted-foreground">Avg. days to complete</p>
                <Badge className="bg-blue-100 text-blue-800 mt-2">15% faster than target</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Retention Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-purple-600">92%</div>
                <p className="text-sm text-muted-foreground">90-day retention rate</p>
                <Badge className="bg-purple-100 text-purple-800 mt-2">Above industry avg</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Satisfaction Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-orange-600">4.6</div>
                <p className="text-sm text-muted-foreground">Out of 5.0</p>
                <Badge className="bg-orange-100 text-orange-800 mt-2">Excellent rating</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Process Improvement Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-3" />
                Process Improvement Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-green-600">✅ Strengths</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Document collection process is 15% faster than target</li>
                    <li>• Buddy program has 4.7/5 satisfaction rating</li>
                    <li>• System access provisioning automated successfully</li>
                    <li>• 30-day check-ins show high engagement scores</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-orange-600">🔄 Improvement Areas</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Training completion time varies significantly by role</li>
                    <li>• Some managers need reminders for check-in scheduling</li>
                    <li>• Benefits enrollment has highest dropout rate</li>
                    <li>• Mobile app usage for onboarding tasks is low</li>
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
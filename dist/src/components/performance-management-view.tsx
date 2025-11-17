import {
    AlertCircle,
    Award,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    FileCheck,
    Plus,
    Settings,
    Star,
    Target,
    TrendingUp,
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

interface PerformanceManagementViewProps {
  onOpenModal: (type: string) => void;
}

const performanceTrendsData = [
  { month: "Jan", avgScore: 3.8, reviews: 45, goals: 234 },
  { month: "Feb", avgScore: 4.1, reviews: 52, goals: 267 },
  { month: "Mar", avgScore: 4.0, reviews: 48, goals: 298 },
  { month: "Apr", avgScore: 4.3, reviews: 61, goals: 312 },
  { month: "May", avgScore: 4.4, reviews: 58, goals: 345 },
  { month: "Jun", avgScore: 4.6, reviews: 67, goals: 378 }
];

const goalCompletionData = [
  { category: "Individual Goals", completed: 156, total: 189, rate: 83 },
  { category: "Team Goals", completed: 89, total: 102, rate: 87 },
  { category: "Department Goals", completed: 23, total: 28, rate: 82 },
  { category: "Company Goals", completed: 12, total: 15, rate: 80 }
];

const performanceDistributionData = [
  { name: "Exceeds Expectations", value: 25, color: "#22c55e" },
  { name: "Meets Expectations", value: 55, color: "#6366f1" },
  { name: "Developing", value: 15, color: "#facc15" },
  { name: "Needs Improvement", value: 5, color: "#ef4444" }
];

const competencyData = [
  { competency: "Technical Skills", score: 4.2 },
  { competency: "Communication", score: 4.0 },
  { competency: "Leadership", score: 3.8 },
  { competency: "Problem Solving", score: 4.3 },
  { competency: "Teamwork", score: 4.1 },
  { competency: "Innovation", score: 3.9 }
];

export function PerformanceManagementView({ onOpenModal }: PerformanceManagementViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("current");

  const handleStartReview = (employeeName: string) => {
    toast.success(`Initiating performance review for ${employeeName}...`, {
      description: "Review cycle started with automated goal tracking"
    });
  };

  const handleUpdateGoal = (goalTitle: string) => {
    toast.success(`Goal "${goalTitle}" updated successfully`, {
      description: "Progress tracking and notifications updated"
    });
  };

  const handleExportReport = () => {
    toast.success("Performance report exported...", {
      description: "Comprehensive analytics data prepared for download"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Performance Management</h2>
          <p className="text-muted-foreground">Employee performance tracking and development system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => onOpenModal("create-review")}>
            <Plus className="h-4 w-4 mr-2" />
            Start Review
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reviews</CardTitle>
            <FileCheck className="h-4 w-4 icon-accent-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">In progress</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+15% vs last cycle</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Performance Score</CardTitle>
            <Star className="h-4 w-4 icon-accent-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-xs text-muted-foreground">Company average</p>
            <Progress value={84} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Completion</CardTitle>
            <Target className="h-4 w-4 icon-accent-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
            <Badge className="bg-green-100 text-green-800 mt-2">On Track</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Completion</CardTitle>
            <CheckCircle className="h-4 w-4 icon-accent-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">On-time completion</p>
            <Badge className="bg-green-100 text-green-800 mt-2">Excellent</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="q1">Q1 2024</SelectItem>
                <SelectItem value="q2">Q2 2024</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 icon-accent-1" />
                Performance Trends & Review Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="right" dataKey="reviews" fill="#6366f1" name="Reviews Completed" />
                  <Bar yAxisId="right" dataKey="goals" fill="#ec4899" name="Goals Tracked" />
                  <Line yAxisId="left" type="monotone" dataKey="avgScore" stroke="#22c55e" strokeWidth={2} name="Avg Performance Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 icon-accent-2" />
                  Performance Rating Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={performanceDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceDistributionData.map((entry, index) => (
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 icon-accent-3" />
                  Core Competency Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={competencyData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="competency" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Review Automation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 icon-accent-4" />
                Review Cycle Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 icon-accent-1" />
                    <h4 className="font-medium">Schedule Management</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Auto-scheduled</span>
                      <Badge className="bg-green-100 text-green-800">156</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending scheduling</span>
                      <Badge variant="outline">23</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Overdue</span>
                      <Badge variant="destructive">7</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 icon-accent-2" />
                    <h4 className="font-medium">Goal Tracking</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active goals</span>
                      <Badge>378</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Auto-progress tracked</span>
                      <Badge className="bg-blue-100 text-blue-800">295</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Manual updates needed</span>
                      <Badge variant="secondary">83</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 icon-accent-3" />
                    <h4 className="font-medium">Peer Feedback</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Requests sent</span>
                      <Badge>234</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <Badge className="bg-green-100 text-green-800">198</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 icon-accent-4" />
                    <h4 className="font-medium">Improvement Plans</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active PIPs</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Successful completions</span>
                      <Badge className="bg-green-100 text-green-800">8</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success rate</span>
                      <span className="font-medium">75%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 icon-accent-1" />
                Upcoming Performance Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Sarah Chen", role: "Senior Developer", type: "Annual", due: "Tomorrow", manager: "John Smith", status: "scheduled" },
                  { name: "Mike Johnson", role: "Product Manager", type: "Mid-year", due: "Friday", manager: "Jane Doe", status: "pending" },
                  { name: "Lisa Wang", role: "UX Designer", type: "Quarterly", due: "Next Monday", manager: "Bob Wilson", status: "overdue" },
                  { name: "David Kim", role: "Data Scientist", type: "Annual", due: "Next Wednesday", manager: "Alice Brown", status: "scheduled" }
                ].map((review, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{review.name}</h4>
                        <Badge variant="outline">{review.role}</Badge>
                        <Badge variant={
                          review.type === "Annual" ? "default" :
                          review.type === "Mid-year" ? "secondary" : "outline"
                        }>
                          {review.type}
                        </Badge>
                        <Badge variant={
                          review.status === "scheduled" ? "default" :
                          review.status === "overdue" ? "destructive" : "outline"
                        }>
                          {review.status === "overdue" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {review.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Due {review.due} • Manager: {review.manager}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStartReview(review.name)}
                      >
                        Start Review
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Active Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 icon-accent-1" />
                Active Performance Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    employee: "Sarah Chen",
                    role: "Senior Developer",
                    reviewType: "Annual Review",
                    progress: 75,
                    currentScore: 4.3,
                    manager: "John Smith",
                    startDate: "June 10",
                    dueDate: "June 25",
                    status: "in-progress",
                    completedSections: ["Self Assessment", "Manager Review"],
                    pendingSections: ["Peer Feedback", "Goal Setting"]
                  },
                  {
                    employee: "Michael Rodriguez", 
                    role: "Product Manager",
                    reviewType: "Mid-year Review",
                    progress: 45,
                    currentScore: 4.1,
                    manager: "Jane Doe",
                    startDate: "June 15",
                    dueDate: "June 30",
                    status: "in-progress",
                    completedSections: ["Self Assessment"],
                    pendingSections: ["Manager Review", "Peer Feedback", "Goal Review"]
                  },
                  {
                    employee: "Emma Davis",
                    role: "UX Designer", 
                    reviewType: "Quarterly Check-in",
                    progress: 90,
                    currentScore: 4.5,
                    manager: "Bob Wilson",
                    startDate: "June 8",
                    dueDate: "June 22",
                    status: "pending-approval",
                    completedSections: ["Self Assessment", "Manager Review", "Peer Feedback"],
                    pendingSections: ["Final Approval"]
                  }
                ].map((review, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{review.employee}</h4>
                        <Badge variant="outline">{review.role}</Badge>
                        <Badge variant={
                          review.status === "in-progress" ? "secondary" :
                          review.status === "pending-approval" ? "default" : "outline"
                        }>
                          {review.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{review.currentScore}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{review.progress}% Complete</p>
                        <Progress value={review.progress} className="w-24 mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Review Type:</span>
                        <p className="font-medium">{review.reviewType}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Manager:</span>
                        <p className="font-medium">{review.manager}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Due Date:</span>
                        <p className="font-medium">{review.dueDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-600 mb-2">Completed Sections:</h5>
                        <div className="flex flex-wrap gap-1">
                          {review.completedSections.map((section, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-orange-600 mb-2">Pending Sections:</h5>
                        <div className="flex flex-wrap gap-1">
                          {review.pendingSections.map((section, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Continue Review
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Review Templates & Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Available Templates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Annual Review Template</span>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mid-year Review Template</span>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quarterly Check-in</span>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>360-Degree Review</span>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Automation Features</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Auto-scheduling</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Reminder notifications</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Peer feedback collection</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Goal progress tracking</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Completion Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>On-time completion rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average review duration</span>
                      <span className="font-medium">8.5 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Peer feedback response rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Manager satisfaction</span>
                      <span className="font-medium">4.6/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Goal Completion Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-1" />
                Goal Tracking & Progress Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={goalCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                  <Bar dataKey="total" fill="#6366f1" name="Total" opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Active Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 icon-accent-2" />
                Currently Tracked Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    employee: "Sarah Chen",
                    goal: "Complete Advanced React Certification",
                    category: "Professional Development",
                    progress: 75,
                    dueDate: "July 15",
                    status: "on-track",
                    priority: "high"
                  },
                  {
                    employee: "Michael Rodriguez",
                    goal: "Launch New Product Feature",
                    category: "Project Delivery",
                    progress: 45,
                    dueDate: "August 30",
                    status: "at-risk",
                    priority: "high"
                  },
                  {
                    employee: "Emma Davis",
                    goal: "Improve Team Collaboration Score by 20%",
                    category: "Team Leadership",
                    progress: 60,
                    dueDate: "September 15",
                    status: "on-track",
                    priority: "medium"
                  },
                  {
                    employee: "James Wilson",
                    goal: "Optimize Data Pipeline Performance",
                    category: "Technical Excellence",
                    progress: 90,
                    dueDate: "June 30",
                    status: "ahead",
                    priority: "medium"
                  }
                ].map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{goal.employee}</h4>
                        <Badge variant="outline">{goal.category}</Badge>
                        <Badge variant={
                          goal.priority === "high" ? "destructive" :
                          goal.priority === "medium" ? "secondary" : "outline"
                        }>
                          {goal.priority}
                        </Badge>
                        <Badge variant={
                          goal.status === "ahead" ? "default" :
                          goal.status === "on-track" ? "secondary" :
                          goal.status === "at-risk" ? "destructive" : "outline"
                        }>
                          {goal.status === "ahead" && <TrendingUp className="h-3 w-3 mr-1" />}
                          {goal.status === "at-risk" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {goal.status}
                        </Badge>
                      </div>
                      <h5 className="font-medium mb-2">{goal.goal}</h5>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Due: {goal.dueDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateGoal(goal.goal)}
                      >
                        Update
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goal Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Goal Categories & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { category: "Individual Goals", total: 189, completed: 156, rate: 83, color: "bg-green-100 text-green-800" },
                  { category: "Team Goals", total: 102, completed: 89, rate: 87, color: "bg-blue-100 text-blue-800" },
                  { category: "Department Goals", total: 28, completed: 23, rate: 82, color: "bg-purple-100 text-purple-800" },
                  { category: "Company Goals", total: 15, completed: 12, rate: 80, color: "bg-orange-100 text-orange-800" }
                ].map((category, index) => (
                  <div key={index} className="text-center space-y-3">
                    <h4 className="font-medium">{category.category}</h4>
                    <div className="text-2xl font-bold">{category.completed}/{category.total}</div>
                    <Progress value={category.rate} className="h-2" />
                    <Badge className={category.color}>{category.rate}% Complete</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Comprehensive Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Review Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600">92%</div>
                <p className="text-sm text-muted-foreground">On-time completion</p>
                <Badge className="bg-green-100 text-green-800 mt-2">Excellent</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Average Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600">4.2/5</div>
                <p className="text-sm text-muted-foreground">Performance rating</p>
                <Badge className="bg-blue-100 text-blue-800 mt-2">Above average</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Goal Success</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-purple-600">83%</div>
                <p className="text-sm text-muted-foreground">Goal completion rate</p>
                <Badge className="bg-purple-100 text-purple-800 mt-2">Strong</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Engagement</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-orange-600">85%</div>
                <p className="text-sm text-muted-foreground">Employee participation</p>
                <Badge className="bg-orange-100 text-orange-800 mt-2">High</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 icon-accent-4" />
                Performance Management Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-green-600">✅ System Strengths</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• 92% on-time review completion rate</li>
                    <li>• High employee satisfaction with review process</li>
                    <li>• 83% goal completion rate exceeds industry average</li>
                    <li>• Automated peer feedback collection saves 40+ hours/month</li>
                    <li>• Real-time goal tracking improves accountability</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-orange-600">🔄 Improvement Opportunities</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Increase peer feedback response rate from 85% to 90%</li>
                    <li>• Reduce average review duration from 8.5 to 7 days</li>
                    <li>• Implement AI-powered goal recommendations</li>
                    <li>• Add more granular progress tracking for complex goals</li>
                    <li>• Enhance mobile experience for on-the-go updates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promotion Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 icon-accent-1" />
                Promotion Readiness Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Chen", role: "Senior Developer", readiness: 92, targetRole: "Tech Lead", timeline: "Q4 2024" },
                  { name: "Michael Rodriguez", role: "Product Manager", readiness: 85, targetRole: "Senior PM", timeline: "Q1 2025" },
                  { name: "Emma Davis", role: "UX Designer", readiness: 78, targetRole: "Design Lead", timeline: "Q2 2025" },
                  { name: "James Wilson", role: "Data Scientist", readiness: 88, targetRole: "Senior Data Scientist", timeline: "Q4 2024" }
                ].map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{candidate.name}</h4>
                        <Badge variant="outline">{candidate.role}</Badge>
                        <Badge variant={candidate.readiness >= 90 ? "default" : candidate.readiness >= 80 ? "secondary" : "outline"}>
                          {candidate.readiness}% ready
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Target: {candidate.targetRole} • Timeline: {candidate.timeline}
                      </p>
                      <Progress value={candidate.readiness} className="mt-2 max-w-xs" />
                    </div>
                    <Button size="sm" variant="outline">
                      View Plan
                    </Button>
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
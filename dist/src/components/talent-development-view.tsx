import {
    ArrowUp,
    Award,
    BarChart3,
    BookOpen,
    Brain,
    Calendar,
    Download,
    Lightbulb,
    MapPin,
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

interface TalentDevelopmentViewProps {
  onOpenModal: (type: string) => void;
}

const skillGapData = [
  { skill: "React", current: 7, required: 9, gap: 2 },
  { skill: "Python", current: 6, required: 8, gap: 2 },
  { skill: "Machine Learning", current: 4, required: 7, gap: 3 },
  { skill: "Leadership", current: 5, required: 8, gap: 3 },
  { skill: "Data Analysis", current: 8, required: 9, gap: 1 },
  { skill: "Cloud Architecture", current: 6, required: 9, gap: 3 }
];

const learningProgressData = [
  { month: "Jan", completed: 45, enrolled: 67, satisfaction: 4.2 },
  { month: "Feb", completed: 52, enrolled: 73, satisfaction: 4.3 },
  { month: "Mar", completed: 48, enrolled: 69, satisfaction: 4.4 },
  { month: "Apr", completed: 61, enrolled: 78, satisfaction: 4.5 },
  { month: "May", completed: 58, enrolled: 82, satisfaction: 4.6 },
  { month: "Jun", completed: 67, enrolled: 89, satisfaction: 4.7 }
];

const careerPathData = [
  { name: "Technical Track", value: 45, color: "#6366f1" },
  { name: "Management Track", value: 30, color: "#ec4899" },
  { name: "Specialist Track", value: 20, color: "#a855f7" },
  { name: "Exploring", value: 5, color: "#facc15" }
];

const mobilityData = [
  { department: "Engineering", internal: 12, external: 3, retention: 92 },
  { department: "Product", internal: 8, external: 2, retention: 89 },
  { department: "Design", internal: 5, external: 1, retention: 95 },
  { department: "Data Science", internal: 7, external: 4, retention: 87 },
  { department: "Sales", internal: 15, external: 6, retention: 85 }
];

export function TalentDevelopmentView({ onOpenModal }: TalentDevelopmentViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const handleCreateLearningPath = (employeeName: string) => {
    toast.success(`Creating personalized learning path for ${employeeName}...`, {
      description: "AI-powered skill recommendations being generated"
    });
  };

  const handleScheduleSession = (sessionName: string) => {
    toast.success(`Scheduled session: ${sessionName}`, {
      description: "Calendar invitation sent to participants"
    });
  };

  const handleExportReport = () => {
    toast.success("Talent development report exported...", {
      description: "Comprehensive analytics and career roadmaps prepared"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Talent Development</h2>
          <p className="text-muted-foreground">Employee growth, learning paths, and career development</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => onOpenModal("create-learning-path")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Learning Path
          </Button>
        </div>
      </div>

      {/* Key Development Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learning Paths</CardTitle>
            <BookOpen className="h-4 w-4 icon-accent-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">89 employees enrolled</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+32% vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Development</CardTitle>
            <Brain className="h-4 w-4 icon-accent-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5</div>
            <p className="text-xs text-muted-foreground">Avg. skill improvement</p>
            <Progress value={92} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internal Mobility</CardTitle>
            <ArrowUp className="h-4 w-4 icon-accent-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Promotions this year</p>
            <Badge className="bg-green-100 text-green-800 mt-2">+18% YoY</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Satisfaction</CardTitle>
            <Star className="h-4 w-4 icon-accent-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">Employee rating</p>
            <Badge className="bg-green-100 text-green-800 mt-2">Excellent</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skill Gaps</TabsTrigger>
            <TabsTrigger value="learning">Learning Paths</TabsTrigger>
            <TabsTrigger value="careers">Career Development</TabsTrigger>
          </TabsList>
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
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Learning Progress Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 icon-accent-1" />
                Learning & Development Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={learningProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="enrolled" fill="#6366f1" name="Enrolled" />
                  <Bar yAxisId="left" dataKey="completed" fill="#22c55e" name="Completed" />
                  <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#ec4899" strokeWidth={2} name="Satisfaction Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Development Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 icon-accent-2" />
                  Internal Mobility & Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mobilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="internal" fill="#22c55e" name="Internal Moves" />
                    <Bar dataKey="external" fill="#ef4444" name="External Hires" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 icon-accent-3" />
                  Career Path Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={careerPathData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {careerPathData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Active Development Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 icon-accent-4" />
                Active Development Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 icon-accent-1" />
                    <h4 className="font-medium">Learning Programs</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Technical Skills Bootcamp</span>
                      <Badge>23 enrolled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leadership Development</span>
                      <Badge>15 enrolled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Science Certification</span>
                      <Badge>31 enrolled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Management Training</span>
                      <Badge>12 enrolled</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 icon-accent-2" />
                    <h4 className="font-medium">Mentorship Programs</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Senior-Junior Mentoring</span>
                      <Badge>34 pairs</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cross-Department Exchange</span>
                      <Badge>18 pairs</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leadership Coaching</span>
                      <Badge>8 participants</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Career Transition Support</span>
                      <Badge>12 participants</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 icon-accent-3" />
                    <h4 className="font-medium">Succession Planning</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Leadership Pipeline</span>
                      <Badge>25 candidates</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>High Potential Program</span>
                      <Badge>15 participants</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Critical Role Coverage</span>
                      <Badge className="bg-green-100 text-green-800">89%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Succession Readiness</span>
                      <Badge className="bg-blue-100 text-blue-800">78%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Development Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 icon-accent-1" />
                Upcoming Development Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "React Advanced Patterns Workshop", date: "Tomorrow", participants: 18, type: "Workshop" },
                  { title: "Leadership Skills Assessment", date: "Friday", participants: 12, type: "Assessment" },
                  { title: "Data Science Career Fair", date: "Next Monday", participants: 45, type: "Event" },
                  { title: "Quarterly Mentorship Matching", date: "Next Wednesday", participants: 67, type: "Program" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge variant="outline">{activity.type}</Badge>
                        <Badge>{activity.participants} participants</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleScheduleSession(activity.title)}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          {/* Skill Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-1" />
                Organization-wide Skill Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillGapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="current" fill="#6366f1" name="Current Level" />
                  <Bar dataKey="required" fill="#22c55e" name="Required Level" />
                  <Bar dataKey="gap" fill="#ef4444" name="Gap" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Individual Skill Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 icon-accent-2" />
                Individual Skill Development Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    employee: "Sarah Chen",
                    role: "Senior Developer",
                    primaryGap: "Leadership",
                    gapLevel: 3,
                    recommendedPath: "Leadership Development Program",
                    timeline: "6 months",
                    priority: "high"
                  },
                  {
                    employee: "Michael Rodriguez",
                    role: "Product Manager",
                    primaryGap: "Data Analysis",
                    gapLevel: 2,
                    recommendedPath: "Advanced Analytics Certification",
                    timeline: "4 months",
                    priority: "medium"
                  },
                  {
                    employee: "Emma Davis",
                    role: "UX Designer",
                    primaryGap: "User Research",
                    gapLevel: 2,
                    recommendedPath: "UX Research Methods Course",
                    timeline: "3 months",
                    priority: "medium"
                  },
                  {
                    employee: "James Wilson",
                    role: "Data Scientist",
                    primaryGap: "Cloud Architecture",
                    gapLevel: 3,
                    recommendedPath: "AWS Solutions Architect Path",
                    timeline: "8 months",
                    priority: "high"
                  }
                ].map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{plan.employee}</h4>
                        <Badge variant="outline">{plan.role}</Badge>
                        <Badge variant={
                          plan.priority === "high" ? "destructive" :
                          plan.priority === "medium" ? "secondary" : "outline"
                        }>
                          {plan.priority} priority
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Primary Gap:</span>
                          <p className="font-medium">{plan.primaryGap} (Level {plan.gapLevel})</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Recommended Path:</span>
                          <p className="font-medium">{plan.recommendedPath}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeline:</span>
                          <p className="font-medium">{plan.timeline}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleCreateLearningPath(plan.employee)}
                      >
                        Create Path
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Development Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 icon-accent-3" />
                AI-Powered Learning Recommendations
              </CardTitle>
            </CardHeader>
            <ContentPanel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Trending Skills in Industry</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Machine Learning</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-16 h-2" />
                        <Badge className="bg-red-100 text-red-800">High Demand</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cloud Architecture</span>
                      <div className="flex items-center gap-2">
                        <Progress value={78} className="w-16 h-2" />
                        <Badge className="bg-orange-100 text-orange-800">Growing</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DevOps</span>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-16 h-2" />
                        <Badge className="bg-yellow-100 text-yellow-800">Stable</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Leadership</span>
                      <div className="flex items-center gap-2">
                        <Progress value={90} className="w-16 h-2" />
                        <Badge className="bg-red-100 text-red-800">Critical</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Organization Priorities</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>React/Frontend</span>
                      <div className="flex items-center gap-2">
                        <Progress value={68} className="w-16 h-2" />
                        <Badge className="bg-blue-100 text-blue-800">Strategic</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Data Analysis</span>
                      <div className="flex items-center gap-2">
                        <Progress value={82} className="w-16 h-2" />
                        <Badge className="bg-purple-100 text-purple-800">Priority</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Project Management</span>
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="w-16 h-2" />
                        <Badge className="bg-green-100 text-green-800">Important</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Communication</span>
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="w-16 h-2" />
                        <Badge className="bg-blue-100 text-blue-800">Essential</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ContentPanel>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          {/* Active Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 icon-accent-1" />
                Active Learning Path Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    employee: "Sarah Chen",
                    path: "Technical Leadership Track",
                    progress: 65,
                    currentModule: "Team Management Fundamentals",
                    completedModules: 8,
                    totalModules: 12,
                    estimatedCompletion: "August 2024",
                    satisfaction: 4.8
                  },
                  {
                    employee: "Michael Rodriguez",
                    path: "Advanced Product Management",
                    progress: 45,
                    currentModule: "Market Research & Analysis",
                    completedModules: 5,
                    totalModules: 11,
                    estimatedCompletion: "September 2024",
                    satisfaction: 4.6
                  },
                  {
                    employee: "Emma Davis",
                    path: "UX Research Specialist",
                    progress: 80,
                    currentModule: "Advanced Usability Testing",
                    completedModules: 7,
                    totalModules: 9,
                    estimatedCompletion: "July 2024",
                    satisfaction: 4.9
                  },
                  {
                    employee: "James Wilson",
                    path: "Machine Learning Engineer",
                    progress: 30,
                    currentModule: "Deep Learning Foundations",
                    completedModules: 4,
                    totalModules: 14,
                    estimatedCompletion: "December 2024",
                    satisfaction: 4.7
                  }
                ].map((learner, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{learner.employee}</h4>
                        <Badge variant="outline">{learner.path}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{learner.satisfaction}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{learner.progress}% Complete</p>
                        <Progress value={learner.progress} className="w-24 mt-1" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Current Module:</span>
                        <p className="font-medium">{learner.currentModule}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Progress:</span>
                        <p className="font-medium">{learner.completedModules}/{learner.totalModules} modules</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Est. Completion:</span>
                        <p className="font-medium">{learner.estimatedCompletion}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Progress
                      </Button>
                      <Button size="sm" variant="outline">
                        Adjust Path
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

          {/* Learning Path Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-2" />
                Available Learning Path Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Full Stack Developer",
                    duration: "6 months",
                    modules: 14,
                    participants: 23,
                    rating: 4.7,
                    skills: ["React", "Node.js", "Database Design", "DevOps"]
                  },
                  {
                    title: "Data Science Professional",
                    duration: "8 months",
                    modules: 16,
                    participants: 18,
                    rating: 4.8,
                    skills: ["Python", "Machine Learning", "Statistics", "Visualization"]
                  },
                  {
                    title: "Technical Leadership",
                    duration: "4 months",
                    modules: 10,
                    participants: 15,
                    rating: 4.6,
                    skills: ["Team Management", "Architecture", "Mentoring", "Strategy"]
                  },
                  {
                    title: "Product Management",
                    duration: "5 months",
                    modules: 12,
                    participants: 12,
                    rating: 4.5,
                    skills: ["Market Research", "Roadmapping", "Analytics", "Leadership"]
                  },
                  {
                    title: "UX/UI Specialist",
                    duration: "6 months",
                    modules: 13,
                    participants: 20,
                    rating: 4.9,
                    skills: ["User Research", "Design Systems", "Prototyping", "Testing"]
                  },
                  {
                    title: "DevOps Engineer",
                    duration: "7 months",
                    modules: 15,
                    participants: 16,
                    rating: 4.4,
                    skills: ["Cloud Platforms", "CI/CD", "Monitoring", "Security"]
                  }
                ].map((template, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">{template.title}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{template.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{template.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Modules:</span>
                        <span>{template.modules}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Active learners:</span>
                        <span>{template.participants}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-2">Key Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.skills.map((skill, skillIdx) => (
                          <Badge key={skillIdx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Assign to Employee
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          {/* Career Development Roadmaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 icon-accent-1" />
                Individual Career Development Roadmaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    employee: "Sarah Chen",
                    currentRole: "Senior Developer",
                    targetRole: "Tech Lead",
                    timeline: "12 months",
                    progress: 75,
                    nextMilestone: "Complete Leadership Assessment",
                    competenciesGained: 8,
                    competenciesNeeded: 3,
                    mentorAssigned: "John Smith (Engineering Director)"
                  },
                  {
                    employee: "Michael Rodriguez",
                    currentRole: "Product Manager",
                    targetRole: "Senior Product Manager",
                    timeline: "18 months", 
                    progress: 60,
                    nextMilestone: "Lead Cross-functional Project",
                    competenciesGained: 6,
                    competenciesNeeded: 4,
                    mentorAssigned: "Jane Doe (VP Product)"
                  },
                  {
                    employee: "Emma Davis",
                    currentRole: "UX Designer",
                    targetRole: "Design Lead",
                    timeline: "15 months",
                    progress: 45,
                    nextMilestone: "Present to Executive Team",
                    competenciesGained: 5,
                    competenciesNeeded: 6,
                    mentorAssigned: "Alice Brown (Head of Design)"
                  }
                ].map((roadmap, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{roadmap.employee}</h4>
                        <Badge variant="outline">{roadmap.currentRole}</Badge>
                        <ArrowUp className="h-4 w-4 text-muted-foreground" />
                        <Badge>{roadmap.targetRole}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{roadmap.progress}% Progress</p>
                        <Progress value={roadmap.progress} className="w-24 mt-1" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Timeline:</span>
                        <p className="font-medium">{roadmap.timeline}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Next Milestone:</span>
                        <p className="font-medium">{roadmap.nextMilestone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Competencies:</span>
                        <p className="font-medium">{roadmap.competenciesGained}/{roadmap.competenciesGained + roadmap.competenciesNeeded}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm text-muted-foreground">Assigned Mentor:</span>
                      <p className="font-medium">{roadmap.mentorAssigned}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Full Roadmap
                      </Button>
                      <Button size="sm" variant="outline">
                        Update Progress
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Succession Planning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 icon-accent-2" />
                Succession Planning & Leadership Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Critical Roles Coverage</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Engineering Director</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">3 candidates</Badge>
                        <Badge className="bg-green-100 text-green-800">Ready</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Product Manager</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">2 candidates</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">6 months</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Design Lead</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-800">1 candidate</Badge>
                        <Badge className="bg-orange-100 text-orange-800">12 months</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Data Science Manager</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">0 candidates</Badge>
                        <Badge className="bg-red-100 text-red-800">At Risk</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">High Potential Employees</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Sarah Chen", role: "Senior Developer", potential: "Leadership Track", readiness: "90%" },
                      { name: "Lisa Wang", role: "Senior Designer", potential: "Management Track", readiness: "75%" },
                      { name: "David Kim", role: "Staff Engineer", potential: "Technical Lead", readiness: "85%" },
                      { name: "Maria Garcia", role: "Senior PM", potential: "Director Track", readiness: "70%" }
                    ].map((candidate, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.role}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">{candidate.potential}</Badge>
                          <p className="text-xs mt-1">{candidate.readiness}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Impact Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 icon-accent-3" />
                Development Program Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">89%</div>
                  <p className="text-sm text-muted-foreground">Employee Retention</p>
                  <Badge className="bg-green-100 text-green-800">+5% YoY</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">47</div>
                  <p className="text-sm text-muted-foreground">Internal Promotions</p>
                  <Badge className="bg-blue-100 text-blue-800">+18% YoY</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">4.6/5</div>
                  <p className="text-sm text-muted-foreground">Development Satisfaction</p>
                  <Badge className="bg-purple-100 text-purple-800">High</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">78%</div>
                  <p className="text-sm text-muted-foreground">Goal Achievement</p>
                  <Badge className="bg-orange-100 text-orange-800">Above Target</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Fix typo in CardContent component
const ContentPanel = CardContent;
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  DollarSign, 
  Star, 
  Target, 
  BarChart3,
  Calendar,
  Award,
  CheckCircle,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface SuccessMetricsViewProps {
  onOpenModal: (type: string) => void;
}

const timeToHireData = [
  { month: "Jan", current: 32, target: 28 },
  { month: "Feb", current: 30, target: 28 },
  { month: "Mar", current: 28, target: 28 },
  { month: "Apr", current: 26, target: 28 },
  { month: "May", current: 24, target: 28 },
  { month: "Jun", current: 22, target: 28 }
];

const qualityOfHireData = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 75 },
  { month: "Mar", score: 78 },
  { month: "Apr", score: 82 },
  { month: "May", score: 85 },
  { month: "Jun", score: 88 }
];

const processEfficiencyData = [
  { name: "Resume Screening", accuracy: 96, automated: 85 },
  { name: "Interview Scheduling", accuracy: 98, automated: 92 },
  { name: "Assessment Processing", accuracy: 94, automated: 88 },
  { name: "Reference Checks", accuracy: 89, automated: 45 }
];

const candidateExperienceData = [
  { name: "Excellent", value: 45, color: "#22c55e" },
  { name: "Good", value: 35, color: "#6366f1" },
  { name: "Average", value: 15, color: "#facc15" },
  { name: "Poor", value: 5, color: "#ef4444" }
];

export function SuccessMetricsView({ onOpenModal }: SuccessMetricsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Success Metrics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive KPIs and performance tracking</p>
        </div>
        <Button onClick={() => onOpenModal("export-report")}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="recruitment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recruitment">Recruitment KPIs</TabsTrigger>
          <TabsTrigger value="efficiency">Process Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="recruitment" className="space-y-6">
          {/* Key Recruitment Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time-to-Hire</CardTitle>
                <Clock className="h-4 w-4 icon-accent-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">22 days</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">30% improvement</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Target: 28 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quality of Hire</CardTitle>
                <Star className="h-4 w-4 icon-accent-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88/100</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">22% increase</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">6-month performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost-per-Hire</CardTitle>
                <DollarSign className="h-4 w-4 icon-accent-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,840</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">18% reduction</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Industry avg: $4,100</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hiring Manager Satisfaction</CardTitle>
                <Award className="h-4 w-4 icon-accent-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7/5</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">15% improvement</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on 156 reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Time-to-Hire Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 icon-accent-1" />
                Time-to-Hire Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeToHireData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="Current Time-to-Hire (days)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    name="Target (days)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quality of Hire Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 icon-accent-2" />
                  Quality of Hire Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={qualityOfHireData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#ec4899" 
                      strokeWidth={2}
                      name="Quality Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 icon-accent-5" />
                  Candidate Experience Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={candidateExperienceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {candidateExperienceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-3" />
                Pipeline Conversion Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Application → Screening</h4>
                  <Progress value={78} className="h-2" />
                  <p className="text-xs text-muted-foreground">78% (Target: 75%)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Screening → Assessment</h4>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-muted-foreground">65% (Target: 60%)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Assessment → Interview</h4>
                  <Progress value={42} className="h-2" />
                  <p className="text-xs text-muted-foreground">42% (Target: 40%)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Interview → Offer</h4>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">85% (Target: 80%)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Offer → Acceptance</h4>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground">92% (Target: 90%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          {/* Process Efficiency Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resume Screening</CardTitle>
                <CheckCircle className="h-4 w-4 icon-accent-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Target: 95%</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Automation Ratio</CardTitle>
                <Zap className="h-4 w-4 icon-accent-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">vs Manual Tasks</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Target: 70%</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <TrendingUp className="h-4 w-4 icon-accent-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
                <Clock className="h-4 w-4 icon-accent-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3s</div>
                <p className="text-xs text-muted-foreground">Avg. Response Time</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Optimal</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Process Efficiency Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 icon-accent-1" />
                Process Accuracy vs Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={processEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#6366f1" name="Accuracy %" />
                  <Bar dataKey="automated" fill="#ec4899" name="Automation %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Candidate Dropout Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 icon-accent-5" />
                Candidate Dropout Rates by Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Application Stage</span>
                  <div className="flex items-center gap-2">
                    <Progress value={5} className="w-20 h-2" />
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Screening Stage</span>
                  <div className="flex items-center gap-2">
                    <Progress value={8} className="w-20 h-2" />
                    <span className="text-sm font-medium">8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Assessment Stage</span>
                  <div className="flex items-center gap-2">
                    <Progress value={12} className="w-20 h-2" />
                    <span className="text-sm font-medium">12%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Interview Stage</span>
                  <div className="flex items-center gap-2">
                    <Progress value={15} className="w-20 h-2" />
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Offer Stage</span>
                  <div className="flex items-center gap-2">
                    <Progress value={3} className="w-20 h-2" />
                    <span className="text-sm font-medium">3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Reduction Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-2" />
                Manual Task Reduction Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">70%</div>
                  <p className="text-sm text-muted-foreground">Manual Tasks Reduced</p>
                  <Badge className="bg-green-100 text-green-800">Target Achieved</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">164</div>
                  <p className="text-sm text-muted-foreground">Hours Saved Weekly</p>
                  <Badge className="bg-blue-100 text-blue-800">Efficiency Gain</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">$84K</div>
                  <p className="text-sm text-muted-foreground">Annual Cost Savings</p>
                  <Badge className="bg-purple-100 text-purple-800">ROI: 340%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
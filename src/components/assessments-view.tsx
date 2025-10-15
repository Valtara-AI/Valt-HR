import {
    AlertTriangle,
    Award,
    BarChart3,
    Brain,
    CheckCircle,
    Clock,
    Download,
    FileCheck,
    Filter,
    PauseCircle,
    PlayCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AssessmentsViewProps {
  onOpenModal: (type: string) => void;
}

const assessmentData = [
  { month: "Jan", phase1: 78, phase2: 85 },
  { month: "Feb", phase1: 82, phase2: 88 },
  { month: "Mar", phase1: 79, phase2: 91 },
  { month: "Apr", phase1: 85, phase2: 87 },
  { month: "May", phase1: 88, phase2: 93 },
  { month: "Jun", phase1: 92, phase2: 89 }
];

const skillAssessmentData = [
  { name: "Technical Skills", value: 40, color: "#6366f1" },
  { name: "Communication", value: 25, color: "#ec4899" },
  { name: "Problem Solving", value: 20, color: "#a855f7" },
  { name: "Culture Fit", value: 15, color: "#22c55e" }
];

const completionRatesData = [
  { category: "Phase 1 Technical", completion: 94, pass: 76 },
  { category: "Phase 1 Cognitive", completion: 89, pass: 82 },
  { category: "Phase 1 Communication", completion: 96, pass: 88 },
  { category: "Phase 2 Advanced Tech", completion: 87, pass: 71 },
  { category: "Phase 2 Leadership", completion: 92, pass: 85 }
];

export function AssessmentsView({ onOpenModal }: AssessmentsViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  // selectedPhase currently unused — prefixed with underscore to mark intentional unused state
  const [_selectedPhase, _setSelectedPhase] = useState("phase1");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">AI-Powered Assessments</h2>
          <p className="text-muted-foreground">Phase 4: Comprehensive candidate evaluation system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Exporting assessment report...")}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => onOpenModal("create-assessment")}>
            <FileCheck className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Assessment Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="candidates">Candidate Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Assessment Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phase 1 Assessments</CardTitle>
                <FileCheck className="h-4 w-4 icon-accent-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">Active assessments</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-800">92% pass rate</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phase 2 Assessments</CardTitle>
                <Brain className="h-4 w-4 icon-accent-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Advanced evaluations</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">Top 30% only</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
                <Clock className="h-4 w-4 icon-accent-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 min</div>
                <p className="text-xs text-muted-foreground">Phase 1 average</p>
                <p className="text-xs text-muted-foreground">Phase 2: 78 min</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Quality Score</CardTitle>
                <Award className="h-4 w-4 icon-accent-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88/100</div>
                <p className="text-xs text-muted-foreground">↑ 12% from last month</p>
                <Progress value={88} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Assessment Categories Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-1" />
                Assessment Categories & Weights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Phase 1 Assessment Components</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical Skills Evaluation</span>
                      <div className="flex items-center gap-2">
                        <Progress value={40} className="w-16 h-2" />
                        <span className="text-sm font-medium">40%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cognitive Ability Testing</span>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="w-16 h-2" />
                        <span className="text-sm font-medium">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Communication Assessment</span>
                      <div className="flex items-center gap-2">
                        <Progress value={20} className="w-16 h-2" />
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Culture Fit Questionnaire</span>
                      <div className="flex items-center gap-2">
                        <Progress value={10} className="w-16 h-2" />
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Phase 2 Advanced Assessment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Advanced Technical Scenarios</span>
                      <div className="flex items-center gap-2">
                        <Progress value={35} className="w-16 h-2" />
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Problem-solving Simulations</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-16 h-2" />
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Behavioral Assessment</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-16 h-2" />
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leadership Potential</span>
                      <div className="flex items-center gap-2">
                        <Progress value={15} className="w-16 h-2" />
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 icon-accent-2" />
                Currently Active Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Senior Developer Assessment", candidates: 8, phase: "Phase 1", status: "active", progress: 65 },
                  { title: "Product Manager Evaluation", candidates: 5, phase: "Phase 2", status: "active", progress: 80 },
                  { title: "UX Designer Assessment", candidates: 12, phase: "Phase 1", status: "active", progress: 45 },
                  { title: "Data Scientist Evaluation", candidates: 3, phase: "Phase 2", status: "paused", progress: 90 }
                ].map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{assessment.title}</h4>
                        <Badge variant={assessment.phase === "Phase 1" ? "default" : "secondary"}>
                          {assessment.phase}
                        </Badge>
                        <Badge variant={assessment.status === "active" ? "default" : "outline"}>
                          {assessment.status === "active" ? (
                            <PlayCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <PauseCircle className="h-3 w-3 mr-1" />
                          )}
                          {assessment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {assessment.candidates} candidates • {assessment.progress}% completed
                      </p>
                      <Progress value={assessment.progress} className="mt-2 max-w-xs" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        View Results
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Filter className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 icon-accent-1" />
                Assessment Score Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={assessmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="phase1" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="Phase 1 Average"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="phase2" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    name="Phase 2 Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Rates Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 icon-accent-2" />
                  Completion & Pass Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={completionRatesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#6366f1" name="Completion %" />
                    <Bar dataKey="pass" fill="#22c55e" name="Pass %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 icon-accent-3" />
                  Skill Assessment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={skillAssessmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {skillAssessmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">92%</div>
                  <p className="text-sm text-muted-foreground">Overall Completion Rate</p>
                  <Badge className="bg-green-100 text-green-800">+8% vs last month</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">76%</div>
                  <p className="text-sm text-muted-foreground">Average Pass Rate</p>
                  <Badge className="bg-blue-100 text-blue-800">Industry standard</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">45min</div>
                  <p className="text-sm text-muted-foreground">Average Duration</p>
                  <Badge className="bg-purple-100 text-purple-800">Optimal range</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">4.7/5</div>
                  <p className="text-sm text-muted-foreground">Candidate Satisfaction</p>
                  <Badge className="bg-orange-100 text-orange-800">Excellent</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          {/* Candidate Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 icon-accent-1" />
                Candidate Assessment Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Chen", role: "Senior Developer", phase1: 94, phase2: 88, status: "completed", timeSpent: "42 min" },
                  { name: "Michael Rodriguez", role: "Product Manager", phase1: 87, phase2: 0, status: "in-progress", timeSpent: "23 min" },
                  { name: "Emma Davis", role: "UX Designer", phase1: 91, phase2: 95, status: "completed", timeSpent: "51 min" },
                  { name: "James Wilson", role: "Data Scientist", phase1: 78, phase2: 0, status: "scheduled", timeSpent: "0 min" },
                  { name: "Lisa Thompson", role: "Senior Developer", phase1: 89, phase2: 92, status: "completed", timeSpent: "47 min" }
                ].map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{candidate.name}</h4>
                        <Badge variant="outline">{candidate.role}</Badge>
                        <Badge variant={
                          candidate.status === "completed" ? "default" : 
                          candidate.status === "in-progress" ? "secondary" : "outline"
                        }>
                          {candidate.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {candidate.status === "in-progress" && <Clock className="h-3 w-3 mr-1" />}
                          {candidate.status === "scheduled" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {candidate.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Phase 1:</span>
                          <span className="ml-2 font-medium">{candidate.phase1 > 0 ? `${candidate.phase1}/100` : "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phase 2:</span>
                          <span className="ml-2 font-medium">{candidate.phase2 > 0 ? `${candidate.phase2}/100` : "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2 font-medium">{candidate.timeSpent}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {candidate.status === "scheduled" && (
                        <Button size="sm">
                          Start Assessment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Queue Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Scheduled Assessments</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Today</span>
                      <Badge>8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tomorrow</span>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">This Week</span>
                      <Badge variant="outline">34</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">In Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Phase 1</span>
                      <Badge variant="secondary">15</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Phase 2</span>
                      <Badge variant="secondary">7</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Review Pending</span>
                      <Badge variant="secondary">3</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Completed Today</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Phase 1 Complete</span>
                      <Badge className="bg-green-100 text-green-800">23</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Phase 2 Complete</span>
                      <Badge className="bg-green-100 text-green-800">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">All Phases Done</span>
                      <Badge className="bg-green-100 text-green-800">5</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
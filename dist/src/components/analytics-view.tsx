import {
  Clock,
  DollarSign,
  Download,
  Filter,
  Target,
  TrendingDown,
  TrendingUp,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
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
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AnalyticsViewProps {
  onOpenModal: (type: string) => void;
}

export function AnalyticsView({ onOpenModal }: AnalyticsViewProps) {
  // Sample data for charts
  const timeToHireData = [
    { month: "Jan", days: 25, target: 20 },
    { month: "Feb", days: 22, target: 20 },
    { month: "Mar", days: 19, target: 20 },
    { month: "Apr", days: 18, target: 20 },
    { month: "May", days: 16, target: 20 },
    { month: "Jun", days: 18, target: 20 }
  ];

  const qualityScoreData = [
    { month: "Jan", score: 4.2 },
    { month: "Feb", score: 4.3 },
    { month: "Mar", score: 4.5 },
    { month: "Apr", score: 4.6 },
    { month: "May", score: 4.8 },
    { month: "Jun", score: 4.8 }
  ];

  const pipelineConversionData = [
    { stage: "Sourcing", candidates: 250, conversion: 100 },
    { stage: "Screening", candidates: 180, conversion: 72 },
    { stage: "Assessment", candidates: 120, conversion: 48 },
    { stage: "Interview", candidates: 80, conversion: 32 },
    { stage: "Final", candidates: 45, conversion: 18 },
    { stage: "Offer", candidates: 25, conversion: 10 }
  ];

  const sourceEffectivenessData = [
    { name: "LinkedIn", value: 35, candidates: 87, hires: 12 },
    { name: "Indeed", value: 25, candidates: 62, hires: 8 },
    { name: "Glassdoor", value: 20, candidates: 48, hires: 6 },
    { name: "Referrals", value: 15, candidates: 35, hires: 8 },
    { name: "Company Site", value: 5, candidates: 18, hires: 2 }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];
  // Tailwind arbitrary color class equivalents for the above COLORS array
  const COLOR_CLASSES = [
    'bg-[#8884d8]',
    'bg-[#82ca9d]',
    'bg-[#ffc658]',
    'bg-[#ff7300]',
    'bg-[#8dd1e1]'
  ];

  const kpis = [
    {
      title: "Time to Hire",
      value: "18 days",
      change: "-30%",
      trend: "down",
      icon: Clock,
      target: "Target: 20 days"
    },
    {
      title: "Quality of Hire",
      value: "4.8/5",
      change: "+0.3",
      trend: "up",
      icon: Target,
      target: "Target: 4.5"
    },
    {
      title: "Cost per Hire",
      value: "$3,200",
      change: "-15%",
      trend: "down",
      icon: DollarSign,
      target: "Target: $3,500"
    },
    {
      title: "Pipeline Efficiency",
      value: "72%",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      target: "Target: 70%"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Recruitment performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.info("Filters panel opened")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onOpenModal("export-report")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
          
          return (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-semibold">{kpi.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      <TrendIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{kpi.change}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.target}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time to Hire Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeToHireData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="days" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#ff7300" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality of Hire Score</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={qualityScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.5, 5]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineConversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="candidates" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stage Conversion Percentages</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineConversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversion" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Source Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceEffectivenessData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceEffectivenessData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sourceEffectivenessData.map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${COLOR_CLASSES[index % COLOR_CLASSES.length]}`}
                        />
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{source.candidates} candidates</p>
                        <p className="text-xs text-muted-foreground">{source.hires} hires</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Recruitment Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeToHireData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="days" stroke="#8884d8" strokeWidth={2} name="Time to Hire" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">Positive Trend</span>
              </div>
              <p className="text-sm">Time-to-hire reduced by 30% over the last 6 months through process automation.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-600">Optimization</span>
              </div>
              <p className="text-sm">LinkedIn sourcing shows highest quality candidates with 35% conversion rate.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-600">Focus Area</span>
              </div>
              <p className="text-sm">Interview stage shows 15% drop-off rate. Consider optimizing interview experience.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
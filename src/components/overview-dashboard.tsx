// Button intentionally unused in this view
import {
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Star,
    Target,
    TrendingUp,
    Users
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface OverviewDashboardProps {
  onNavigateToSection: (section: string) => void;
  onOpenModal: (type: string) => void;
}

export function OverviewDashboard({ onNavigateToSection, onOpenModal }: OverviewDashboardProps) {
  // onOpenModal may be unused in some contexts; prefix to avoid lint warnings if not used
  const _onOpenModal = onOpenModal;
  const metrics = [
    {
      title: "Active Candidates",
      value: "247",
      change: "+12%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Avg. Time to Hire",
      value: "18 days",
      change: "-30%",
      icon: Clock,
      trend: "down"
    },
    {
      title: "Quality Score",
      value: "4.8/5",
      change: "+0.3",
      icon: Star,
      trend: "up"
    },
    {
      title: "Cost per Hire",
      value: "$3,200",
      change: "-15%",
      icon: DollarSign,
      trend: "down"
    }
  ];

  const pipelineStats = [
    { stage: "Sourcing", count: 89, percentage: 36 },
    { stage: "Screening", count: 67, percentage: 27 },
    { stage: "Assessment", count: 34, percentage: 14 },
    { stage: "Interview", count: 28, percentage: 11 },
    { stage: "Final Review", count: 19, percentage: 8 },
    { stage: "Offer", count: 10, percentage: 4 }
  ];

  const recentActivity = [
    { action: "New application", candidate: "Sarah Chen", role: "Senior Developer", time: "2 min ago" },
    { action: "Interview scheduled", candidate: "Mike Johnson", role: "Product Manager", time: "15 min ago" },
    { action: "Assessment completed", candidate: "Emma Davis", role: "UX Designer", time: "1 hour ago" },
    { action: "Offer accepted", candidate: "Alex Rodriguez", role: "Data Scientist", time: "2 hours ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-semibold mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant={metric.trend === "up" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStats.map((stage) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">{stage.count} candidates</span>
                  </div>
                  <Progress value={stage.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-1 bg-primary/10 rounded-full mt-1">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span> for{" "}
                      <span className="font-medium">{activity.candidate}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              className="p-4 rounded-lg border border-dashed border-border hover:bg-muted/50 transition-colors"
              onClick={() => onOpenModal("post-job")}
            >
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Post New Job</p>
            </button>
            <button 
              className="p-4 rounded-lg border border-dashed border-border hover:bg-muted/50 transition-colors"
              onClick={() => onNavigateToSection("candidates")}
            >
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Bulk Screen</p>
            </button>
            <button 
              className="p-4 rounded-lg border border-dashed border-border hover:bg-muted/50 transition-colors"
              onClick={() => onOpenModal("schedule-interview")}
            >
              <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Schedule Interviews</p>
            </button>
            <button 
              className="p-4 rounded-lg border border-dashed border-border hover:bg-muted/50 transition-colors"
              onClick={() => onNavigateToSection("analytics")}
            >
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">View Analytics</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
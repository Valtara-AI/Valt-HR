import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { 
  Search, 
  FileText, 
  Users, 
  Brain, 
  Phone, 
  Database, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface PipelineViewProps {
  onOpenModal: (type: string) => void;
}

export function PipelineView({ onOpenModal }: PipelineViewProps) {
  const phases = [
    {
      id: 1,
      title: "Candidate Sourcing & Job Posting",
      icon: Search,
      status: "active",
      candidates: 89,
      completion: 85,
      subPhases: [
        { name: "LinkedIn Sourcing", status: "completed", count: 34 },
        { name: "Job Board Distribution", status: "active", count: 28 },
        { name: "Matching Algorithm", status: "active", count: 27 }
      ]
    },
    {
      id: 2,
      title: "Application Processing",
      icon: FileText,
      status: "active",
      candidates: 67,
      completion: 78,
      subPhases: [
        { name: "Resume Parsing", status: "completed", count: 67 },
        { name: "Application Validation", status: "active", count: 52 },
        { name: "Duplicate Detection", status: "pending", count: 0 }
      ]
    },
    {
      id: 3,
      title: "Candidate Evaluation & Enrichment",
      icon: Users,
      status: "active",
      candidates: 45,
      completion: 62,
      subPhases: [
        { name: "Resume Scoring", status: "active", count: 45 },
        { name: "Social Media Audit", status: "active", count: 32 },
        { name: "Background Validation", status: "pending", count: 18 }
      ]
    },
    {
      id: 4,
      title: "AI-Powered Assessments",
      icon: Brain,
      status: "active",
      candidates: 34,
      completion: 45,
      subPhases: [
        { name: "Phase 1 Assessment", status: "active", count: 34 },
        { name: "Phase 2 Assessment", status: "pending", count: 12 },
        { name: "Advanced Scenarios", status: "pending", count: 0 }
      ]
    },
    {
      id: 5,
      title: "Phone Interview Process",
      icon: Phone,
      status: "pending",
      candidates: 28,
      completion: 30,
      subPhases: [
        { name: "AI-Conducted Interviews", status: "active", count: 15 },
        { name: "Human Interview Analysis", status: "pending", count: 8 },
        { name: "Transcript Analysis", status: "pending", count: 5 }
      ]
    },
    {
      id: 6,
      title: "CRM Integration & Notification",
      icon: Database,
      status: "pending",
      candidates: 19,
      completion: 15,
      subPhases: [
        { name: "Data Population", status: "pending", count: 12 },
        { name: "Stakeholder Notifications", status: "pending", count: 7 },
        { name: "Report Generation", status: "pending", count: 0 }
      ]
    },
    {
      id: 7,
      title: "Final Interview Coordination",
      icon: Calendar,
      status: "pending",
      candidates: 10,
      completion: 8,
      subPhases: [
        { name: "Scheduling Automation", status: "pending", count: 6 },
        { name: "Interview Packet Prep", status: "pending", count: 4 },
        { name: "Feedback Collection", status: "pending", count: 0 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "active": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "active": return Clock;
      case "pending": return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Recruitment Pipeline</h2>
          <p className="text-muted-foreground">End-to-end process overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenModal("export-report")}>Export Report</Button>
          <Button onClick={() => alert("Pipeline optimization in progress...")}>Optimize Pipeline</Button>
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isLastPhase = index === phases.length - 1;
          
          return (
            <div key={phase.id} className="relative">
              <Card className={`${phase.status === 'active' ? 'ring-2 ring-primary/20' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                        phase.status === 'active' ? 'bg-primary/10 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{phase.title}</CardTitle>
                        <Badge variant={getStatusColor(phase.status)} className="mt-1">
                          {phase.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Candidates</span>
                      <span className="font-medium">{phase.candidates}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm">{phase.completion}%</span>
                      </div>
                      <Progress value={phase.completion} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Sub-phases:</p>
                      {phase.subPhases.map((subPhase, subIndex) => {
                        const StatusIcon = getStatusIcon(subPhase.status);
                        return (
                          <div key={subIndex} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="h-3 w-3" />
                              <span>{subPhase.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {subPhase.count}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow connector */}
              {!isLastPhase && (
                <div className="hidden xl:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="bg-background border rounded-full p-1">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pipeline Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">127</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">89</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-orange-600">31</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-red-600">12</p>
              <p className="text-sm text-muted-foreground">Stalled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
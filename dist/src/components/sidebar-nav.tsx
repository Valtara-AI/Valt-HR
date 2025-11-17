import {
    Award,
    BarChart3,
    Brain,
    Calendar,
    Database,
    FileCheck,
    FileText,
    LayoutDashboard,
    MessageSquare,
    Phone,
    Search,
    Server,
    Settings,
    Target,
    TrendingUp,
    UserCheck,
    UserPlus,
    Users
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface SidebarNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

type LocalNavItem = { id: string; label: string; icon: React.ComponentType<React.ComponentProps<'svg'>>; badge?: string; iconColor?: string };

export function SidebarNav({ activeSection, onSectionChange }: SidebarNavProps) {
  const recruitmentPhases = [
    // Phase 1: Candidate Sourcing & Job Posting
    { id: "sourcing", label: "Job Sourcing", icon: Search, badge: "47", iconColor: "icon-accent-1" },
    // Phase 2: Application Processing
    { id: "processing", label: "Resume Processing", icon: FileText, badge: "247", iconColor: "icon-accent-2" },
    // Phase 3: Candidate Evaluation & Enrichment
    { id: "evaluation", label: "Candidate Evaluation", icon: UserCheck, badge: "89", iconColor: "icon-accent-3" },
    // Phase 4: AI-Powered Assessments
    { id: "assessments", label: "AI Assessments", icon: FileCheck, badge: "34", iconColor: "icon-accent-4" },
    // Phase 5: Phone Interview Process
    { id: "ai-interviews", label: "AI Interviews", icon: Phone, badge: "8", iconColor: "icon-accent-5" },
    // Phase 6: CRM Integration & Notification
    { id: "pipeline", label: "Pipeline", icon: Target, badge: "12", iconColor: "icon-accent-1" },
    { id: "candidates", label: "Candidates", icon: Users, badge: "45", iconColor: "icon-accent-2" },
    // Phase 7: Final Interview Coordination
    { id: "interviews", label: "Human Interviews", icon: MessageSquare, badge: "5", iconColor: "icon-accent-3" },
    { id: "scheduling", label: "Scheduling", icon: Calendar, badge: "3", iconColor: "icon-accent-4" }
  ];

  const extendedHRFunctions = [
    { id: "onboarding", label: "Onboarding", icon: UserPlus, badge: "8", iconColor: "icon-accent-5" },
    { id: "performance", label: "Performance Mgmt", icon: TrendingUp, badge: "2", iconColor: "icon-accent-1" },
    { id: "talent-development", label: "Talent Development", icon: Brain, badge: "12", iconColor: "icon-accent-2" },
    { id: "crm-integration", label: "CRM Integration", icon: Database, badge: "3", iconColor: "icon-accent-3" }
  ];

  const systemSections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, iconColor: "icon-accent-3" },
    { id: "analytics", label: "Analytics", icon: BarChart3, iconColor: "icon-accent-4" },
    { id: "success-metrics", label: "Success Metrics", icon: Award, iconColor: "icon-accent-5" },
    { id: "technology-stack", label: "Technology Stack", icon: Server, iconColor: "icon-accent-1" }
  ];

  const renderNavSection = (title: string, items: LocalNavItem[]) => (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3">
        {title}
      </h3>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-between text-left"
            onClick={() => onSectionChange(item.id)}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-4 w-4 ${item.iconColor}`} />
              <span className="text-sm">{item.label}</span>
            </div>
            {item.badge && (
              <Badge variant="outline" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );

  return (
    <nav className="w-72 border-r bg-card p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* System Overview */}
        {renderNavSection("Dashboard", systemSections)}
        
        <Separator />
        
        {/* 7-Phase Recruitment Pipeline */}
        {renderNavSection("Recruitment Pipeline", recruitmentPhases)}
        
        <Separator />
        
        {/* Extended HR Functions */}
        {renderNavSection("HR Functions", extendedHRFunctions)}
        
        <Separator />
        
        {/* Settings */}
        <div className="space-y-2">
          <Button 
            variant={activeSection === "settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSectionChange("settings")}
          >
            <Settings className="h-4 w-4 mr-3 icon-accent-5" />
            <span className="text-sm">Settings</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
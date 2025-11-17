import {
    ArrowLeft,
    BarChart3,
    Brain,
    Calendar,
    ChevronRight,
    FileCheck,
    FileText,
    Home,
    LogOut,
    MessageSquare,
    Phone,
    Search,
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

interface NavigationBarProps {
  currentSection: string;
  onNavigateToSection: (section: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  showLandingBack?: boolean;
  onGoToLanding?: () => void;
}

export function NavigationBar({ 
  currentSection, 
  onNavigateToSection, 
  onGoBack, 
  canGoBack, 
  showLandingBack = false,
  onGoToLanding 
}: NavigationBarProps) {
  type SectionInfo = { label: string; icon: React.ComponentType<React.ComponentProps<'svg'>>; badge?: string };

  const sectionMap: Record<string, SectionInfo> = {
    overview: { label: "Overview", icon: Home },
    // Phase 1: Candidate Sourcing & Job Posting
    sourcing: { label: "Job Sourcing", icon: Search, badge: "47" },
    // Phase 2: Application Processing  
    processing: { label: "Resume Processing", icon: FileText, badge: "247" },
    // Phase 3: Candidate Evaluation & Enrichment
    evaluation: { label: "Candidate Evaluation", icon: UserCheck, badge: "89" },
    // Phase 4: AI-Powered Assessments
    assessments: { label: "AI Assessments", icon: FileCheck, badge: "34" },
    // Phase 5: Phone Interview Process
    "ai-interviews": { label: "AI Interviews", icon: Phone, badge: "8" },
    // Phase 6: CRM Integration & Notification
    pipeline: { label: "Pipeline", icon: Target, badge: "12" },
    candidates: { label: "Candidates", icon: Users, badge: "45" },
    // Phase 7: Final Interview Coordination
    interviews: { label: "Human Interviews", icon: MessageSquare, badge: "5" },
    scheduling: { label: "Scheduling", icon: Calendar, badge: "3" },
    // Extended HR Functions
    onboarding: { label: "Onboarding", icon: UserPlus, badge: "8" },
    performance: { label: "Performance Mgmt", icon: TrendingUp, badge: "2" },
    "talent-development": { label: "Talent Development", icon: Brain, badge: "12" },
    // Analytics & Settings
    analytics: { label: "Analytics", icon: BarChart3 },
    settings: { label: "Settings", icon: Settings }
  };

  const quickNavItems = ["overview", "pipeline", "candidates", "analytics"];
  
  const currentSectionInfo = sectionMap[currentSection as keyof typeof sectionMap];

  return (
    <div className="bg-card border-b p-4 space-y-4">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          {canGoBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          
          {/* Landing Page Back Button */}
          {showLandingBack && onGoToLanding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // In a real app, this would handle the actual logout logic
                if (window.confirm("Are you sure you want to sign out?")) {
                  window.location.reload(); // Simple logout simulation
                }
              }}
              className="flex items-center gap-2 text-destructive hover:bg-destructive/10 border-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">
              {currentSectionInfo?.label || "Dashboard"}
            </span>
            {currentSectionInfo?.badge && (
              <Badge variant="secondary" className="ml-1">
                {currentSectionInfo.badge}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Quick Access:</span>
          {quickNavItems.map((item) => {
            const info = sectionMap[item as keyof typeof sectionMap];
            const Icon = info.icon;
            const isActive = currentSection === item;
            
            return (
              <Button
                key={item}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNavigateToSection(item)}
                className="flex items-center gap-2"
                disabled={isActive}
              >
                <Icon className="h-4 w-4 icon-accent-1" />
                {info.label}
                {info.badge && (
                  <Badge variant="outline" className="ml-1">
                    {info.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Section Navigation Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground mr-2">All Sections:</span>
        {Object.entries(sectionMap).map(([key, info]) => {
          const Icon = info.icon;
          const isActive = currentSection === key;
          
          return (
            <Button
              key={key}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onNavigateToSection(key)}
              className="flex items-center gap-2"
              disabled={isActive}
            >
              <Icon className={`h-4 w-4 ${
                key === "overview" ? "icon-accent-1" :
                key === "pipeline" ? "icon-accent-2" :
                key === "candidates" ? "icon-accent-3" :
                key === "assessments" ? "icon-accent-4" :
                key === "interviews" ? "icon-accent-5" :
                key === "scheduling" ? "icon-accent-1" :
                key === "analytics" ? "icon-accent-2" :
                key === "onboarding" ? "icon-accent-3" :
                key === "settings" ? "icon-accent-4" :
                "icon-accent-5"
              }`} />
              {info.label}
              {info.badge && (
                <Badge variant="outline" className="ml-1">
                  {info.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // In a real app, this would handle the actual logout logic
            if (window.confirm("Are you sure you want to sign out?")) {
              window.location.reload(); // Simple logout simulation
            }
          }}
          className="flex items-center gap-2 text-destructive hover:bg-destructive/10 border-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
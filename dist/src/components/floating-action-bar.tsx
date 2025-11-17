import { Button } from "./ui/button";
import { 
  Home, 
  ArrowLeft, 
  Users, 
  Target, 
  BarChart3, 
  Plus,
  MoreHorizontal,
  Settings,
  FileCheck,
  MessageSquare,
  Calendar,
  UserPlus
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface FloatingActionBarProps {
  currentSection: string;
  onNavigateToSection: (section: string) => void;
  onGoBack: () => void;
  onGoHome: () => void;
  onOpenModal?: (type: string) => void;
  canGoBack: boolean;
}

export function FloatingActionBar({ 
  currentSection, 
  onNavigateToSection, 
  onGoBack, 
  onGoHome,
  onOpenModal,
  canGoBack 
}: FloatingActionBarProps) {
  const quickActions = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "pipeline", label: "Pipeline", icon: Target },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ];

  const allSections = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "pipeline", label: "Pipeline", icon: Target },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "assessments", label: "Assessments", icon: FileCheck },
    { id: "interviews", label: "Interviews", icon: MessageSquare },
    { id: "scheduling", label: "Scheduling", icon: Calendar },
    { id: "onboarding", label: "Onboarding", icon: UserPlus },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const modalActions = [
    { id: "post-job", label: "Post Job", icon: Plus },
    { id: "add-candidate", label: "Add Candidate", icon: Users },
    { id: "schedule-interview", label: "Schedule Interview", icon: Target },
    { id: "export-report", label: "Export Report", icon: BarChart3 }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 bg-card border rounded-full shadow-lg p-2">
        {/* Back Button */}
        {canGoBack && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onGoBack}
            className="rounded-full h-10 w-10 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Home Button */}
        <Button
          size="sm"
          variant={currentSection === "overview" ? "secondary" : "ghost"}
          onClick={onGoHome}
          className="rounded-full h-10 w-10 p-0"
        >
          <Home className="h-4 w-4" />
        </Button>

        {/* Quick Navigation */}
        {quickActions
          .filter(action => action.id !== currentSection && action.id !== "overview")
          .slice(0, 2)
          .map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                size="sm"
                variant="ghost"
                onClick={() => onNavigateToSection(action.id)}
                className="rounded-full h-10 w-10 p-0"
                title={action.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-10 w-10 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold">Navigate to</div>
            <DropdownMenuSeparator />
            {allSections
              .filter(action => action.id !== currentSection)
              .map((action) => {
                const Icon = action.icon;
                return (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => onNavigateToSection(action.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </DropdownMenuItem>
                );
              })}
            
            {onOpenModal && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-sm font-semibold">Quick Actions</div>
                <DropdownMenuSeparator />
                {modalActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={() => onOpenModal(action.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </DropdownMenuItem>
                  );
                })}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
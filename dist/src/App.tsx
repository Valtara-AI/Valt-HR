import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AIInterviewsView } from "./components/ai-interviews-view";
import { AnalyticsView } from "./components/analytics-view";
import { AssessmentsView } from "./components/assessments-view";
import { AuthPages } from "./components/auth-pages";
import { CandidateEvaluationView } from "./components/candidate-evaluation-view";
import { CandidatesView } from "./components/candidates-view";
import { CRMIntegrationView } from "./components/crm-integration-view";
import { DashboardHeader } from "./components/dashboard-header";
import { FloatingActionBar } from "./components/floating-action-bar";
import { InterviewsView } from "./components/interviews-view";
import { JobSourcingView } from "./components/job-sourcing-view";
import { LandingPage } from "./components/landing-page";
import { ModalDialogs } from "./components/modal-dialogs";
import { NavigationBar } from "./components/navigation-bar";
import { OnboardingView } from "./components/onboarding-view";
import { OverviewDashboard } from "./components/overview-dashboard";
import { PerformanceManagementView } from "./components/performance-management-view";
import { PipelineView } from "./components/pipeline-view";
import { ResumeProcessingView } from "./components/resume-processing-view";
import { SchedulingView } from "./components/scheduling-view";
import { SettingsView } from "./components/settings-view";
import { SidebarNav } from "./components/sidebar-nav";
import { SuccessMetricsView } from "./components/success-metrics-view";
import { TalentDevelopmentView } from "./components/talent-development-view";
import { TechnologyStackView } from "./components/technology-stack-view";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "auth" | "dashboard">("landing");
  const [activeSection, setActiveSection] = useState("overview");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["overview"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Initialize theme on app start
  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleSectionChange = (section: string) => {
    if (section !== activeSection) {
      setNavigationHistory(prev => [...prev, section]);
      setActiveSection(section);
    }
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current section
      const previousSection = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setActiveSection(previousSection);
    }
  };

  const handleGoToLanding = () => {
    setCurrentView("landing");
    setActiveSection("overview");
    setNavigationHistory(["overview"]);
  };

  const handleGetStarted = () => {
    setCurrentView("auth");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleSignInSuccess = () => {
    setCurrentView("dashboard");
    toast.success("Welcome to Valt HR Suite!");
  };

  const handleOpenModal = (type: string) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType("");
  };

  const handleModalConfirm = (data?: Record<string, unknown>) => {
    const d = (data || {}) as Record<string, unknown>;
    const toStringSafe = (key: string, fallback = ''): string => {
      const v = d[key];
      return typeof v === 'string' || typeof v === 'number' ? String(v) : fallback;
    };
    const jobTitle = toStringSafe('jobTitle', 'New job');
    const department = toStringSafe('department', 'selected department');
    switch (modalType) {
      case "post-job":
        toast.success("Job posted successfully!", {
          description: `${jobTitle} in ${department} is now live on all job boards.`
        });
        break;
      case "schedule-interview":
        toast.success("Interview scheduled!", {
          description: `Interview with ${toStringSafe('candidate', 'candidate')} scheduled for ${toStringSafe('date', 'selected date')} at ${toStringSafe('time', 'selected time')}.`
        });
        break;
      case "create-assessment":
        toast.success("Assessment created!", {
          description: `${toStringSafe('assessmentName', 'New assessment')} is ready for candidates.`
        });
        break;
      case "start-onboarding":
        toast.success("Onboarding started!", {
          description: `Onboarding process initiated for ${toStringSafe('newHire', 'new hire')}.`
        });
        break;
      case "export-report":
        toast.success("Report exported!", {
          description: `${toStringSafe('reportType', 'Report')} downloaded as ${toStringSafe('format', 'selected format').toUpperCase()}.`
        });
        break;
      case "add-candidate":
        toast.success("Candidate added!", {
          description: `${toStringSafe('candidateName', 'New candidate')} has been added to the pipeline.`
        });
        break;
      default:
        toast.success("Action completed successfully!");
    }
  };

  const handleSignOut = () => {
    setCurrentView("landing");
    setActiveSection("overview");
    setNavigationHistory(["overview"]);
    toast.success("You have been signed out successfully!", {
      description: "Thank you for using Valt HR Suite."
    });
  };

  if (currentView === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (currentView === "auth") {
    return (
      <AuthPages 
        onBack={handleBackToLanding}
        onSignInSuccess={handleSignInSuccess}
      />
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewDashboard onNavigateToSection={setActiveSection} onOpenModal={handleOpenModal} />;
      case "pipeline":
        return <PipelineView onOpenModal={handleOpenModal} />;
      case "candidates":
        return <CandidatesView onOpenModal={handleOpenModal} />;
      case "analytics":
        return <AnalyticsView onOpenModal={handleOpenModal} />;
      case "assessments":
        return <AssessmentsView onOpenModal={handleOpenModal} />;
      case "interviews":
        return <InterviewsView onOpenModal={handleOpenModal} />;
      case "scheduling":
        return <SchedulingView onOpenModal={handleOpenModal} />;
      case "onboarding":
        return <OnboardingView onOpenModal={handleOpenModal} />;
      case "sourcing":
        return <JobSourcingView onOpenModal={handleOpenModal} />;
      case "processing":
        return <ResumeProcessingView onOpenModal={handleOpenModal} />;
      case "evaluation":
        return <CandidateEvaluationView onOpenModal={handleOpenModal} />;
      case "ai-interviews":
        return <AIInterviewsView onOpenModal={handleOpenModal} />;
      case "performance":
        return <PerformanceManagementView onOpenModal={handleOpenModal} />;
      case "talent-development":
        return <TalentDevelopmentView onOpenModal={handleOpenModal} />;
      case "crm-integration":
        return <CRMIntegrationView onOpenModal={handleOpenModal} />;
      case "success-metrics":
        return <SuccessMetricsView onOpenModal={handleOpenModal} />;
      case "technology-stack":
        return <TechnologyStackView onOpenModal={handleOpenModal} />;
      case "settings":
        return <SettingsView />;
      default:
        return <OverviewDashboard onNavigateToSection={setActiveSection} onOpenModal={handleOpenModal} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader onOpenModal={handleOpenModal} onNavigateToSection={handleSectionChange} onSignOut={handleSignOut} />
      <NavigationBar 
        currentSection={activeSection}
        onNavigateToSection={handleSectionChange}
        onGoBack={handleGoBack}
        canGoBack={navigationHistory.length > 1}
        showLandingBack={true}
        onGoToLanding={handleGoToLanding}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav activeSection={activeSection} onSectionChange={handleSectionChange} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Floating Action Bar for quick navigation */}
      <FloatingActionBar
        currentSection={activeSection}
        onNavigateToSection={handleSectionChange}
        onGoBack={handleGoBack}
        onGoHome={() => handleSectionChange("overview")}
        onOpenModal={handleOpenModal}
        canGoBack={navigationHistory.length > 1}
      />
      
      <ModalDialogs 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        type={modalType}
        onConfirm={handleModalConfirm}
      />
      <Toaster />
    </div>
  );
}
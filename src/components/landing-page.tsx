import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  Play,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "./BrandLogo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      iconColor: "icon-accent-1",
      title: "GPT-4-Assisted Interviews & Assessments",
      description: "Phone interview transcripts and assessment responses are analyzed and graded by GPT-4, so every candidate gets a structured, written evaluation instead of a recruiter's memory of the call."
    },
    {
      icon: Target,
      iconColor: "icon-accent-2",
      title: "7-Stage Recruitment Pipeline",
      description: "Sourcing, application processing, evaluation, assessments, interviews, CRM sync, and final coordination — each candidate's stage and completion status tracked in real time."
    },
    {
      icon: Users,
      iconColor: "icon-accent-3",
      title: "Weighted Resume Scoring",
      description: "Every resume is scored against the job's requirements — skills (40%), experience (30%), education (20%), other factors (10%) — with the breakdown shown, not hidden."
    },
    {
      icon: Clock,
      iconColor: "icon-accent-4",
      title: "Automatic Resume Processing",
      description: "Resumes are parsed, checked for duplicates, and queued for scoring the moment a candidate applies — no manual data entry to get a candidate into the pipeline."
    },
    {
      icon: BarChart3,
      iconColor: "icon-accent-5",
      title: "Pipeline & Hiring Analytics",
      description: "Time-to-hire, stage-by-stage funnel counts, and conversion rates calculated from your actual application data — not projected estimates."
    },
    {
      icon: Shield,
      iconColor: "icon-accent-1",
      title: "Full Scoring Audit Trail",
      description: "Every score and score change is logged — what changed, when, and by whom (or by the system) — so a hiring decision can always be explained."
    }
  ];

  const benefits = [
    "Automatic resume parsing, duplicate detection, and weighted scoring",
    "GPT-4-assisted phone interview analysis and assessment grading",
    "Real-time visibility across all 7 pipeline stages",
    "Automated candidate and stakeholder email/SMS notifications",
    "CRM sync and calendar-based interview scheduling",
    "Every scoring decision logged to an audit trail"
  ];

  const personas = [
    {
      role: "Talent Acquisition Leaders",
      statement: "Every resume scored against the job's real requirements — skills, experience, education — with the 40/30/20/10 weighting shown, not a black-box number."
    },
    {
      role: "Heads of HR",
      statement: "GPT-4 grades every phone interview transcript and assessment response, so evaluations don't ride on a recruiter's memory of the call."
    },
    {
      role: "Chief People Officers",
      statement: "Every score and score change is logged — what changed, when, and by whom — so a hiring decision can always be explained."
    }
  ];

  const stats = [
    { value: "7", label: "Pipeline Stages Tracked" },
    { value: "40/30/20/10", label: "Skills / Experience / Education / Other Weighting" },
    { value: "GPT-4", label: "Interview & Assessment Grading" },
    { value: "100%", label: "Scoring Decisions Logged" }
  ];

  const handleFeaturesClick = () => {
    toast.loading("Navigating to features...", { id: "features-nav" });
    
    const featuresSection = document.querySelector('[data-section="features"]');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        toast.success("Features section", {
          id: "features-nav",
          description: "Explore what's built into the recruitment pipeline"
        });
      }, 800);
    } else {
      toast.info("Recruitment Pipeline Features", {
        id: "features-nav",
        description: "• GPT-4-assisted interviews & assessments\n• 7-stage recruitment pipeline\n• Weighted resume scoring (skills/experience/education/other)\n• Automatic resume parsing & duplicate detection\n• Pipeline & hiring analytics\n• Full scoring audit trail",
        duration: 8000
      });
    }
  };

  const handlePricingClick = () => {
    toast.info("Pricing Plans", {
      description: "Enterprise: $99/month • Professional: $49/month • Starter: $19/month"
    });
  };

  const handleAboutClick = () => {
    toast.loading("Loading company information...", { id: "about-nav" });

    setTimeout(() => {
      toast.info("About Valt HR Suite", {
        id: "about-nav",
        description: "Part of the Valtara AI product line, currently in early-adopter testing.\n\nMission: automate the mechanical parts of recruiting — resume parsing, scoring, and pipeline tracking — so hiring decisions are faster and explainable.\n\nWhat's running today:\n• Automatic resume parsing, duplicate detection & weighted scoring\n• GPT-4-assisted interview and assessment grading\n• 7-stage pipeline with real-time tracking\n• Full audit trail on every scoring decision\n\nUse the chat button in the corner to reach us.",
        duration: 12000
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0">
                <BrandLogo width={40} height={40} />
              </div>
              <div>
                <span className="font-semibold text-lg">Valt HR Suite</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleFeaturesClick}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                onClick={handlePricingClick}
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                onClick={handleAboutClick}
              >
                About
              </Button>
              <ThemeToggle />
              <Button onClick={onGetStarted}>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Explainable Scoring, Not a Black Box</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold mb-6 heading-text">
            Know Why
            <br />
            <span className="gradient-text-primary">Every Candidate Scored</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Valt HR Suite parses and scores every resume against the job's real requirements —
            skills, experience, education — instead of a gut call. GPT-4 handles interview
            transcript analysis and assessment grading, and every candidate moves through a
            7-stage pipeline with a full audit trail on every score.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={onGetStarted}>
              <BarChart3 className="h-5 w-5 mr-2" />
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-semibold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-muted/30" data-section="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">What's Running In the Pipeline</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Six systems working on every application, from the moment a resume lands
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-semibold mb-6">
                Built Around
                <span className="text-primary"> a Real Pipeline</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Not a dashboard bolted onto a black box — every score, stage, and
                notification below is generated by the system as candidates move through it.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 bg-primary/10 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="mt-8" onClick={onGetStarted}>
                <Zap className="h-5 w-5 mr-2" />
                Get Started Now
              </Button>
            </div>
            
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Weighted Scoring</div>
                      <div className="text-muted-foreground">Skills 40% · Experience 30% · Education 20% · Other 10%</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Time-to-Hire</div>
                      <div className="text-muted-foreground">Calculated from your own pipeline data</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Audit Trail</div>
                      <div className="text-muted-foreground">Every score change logged — who, when, why</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's Built For */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">Built For Teams Like Yours</h2>
            <p className="text-xl text-muted-foreground">
              Illustrative use cases, not customer quotes — Valt HR Suite is in early-adopter testing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {personas.map((persona, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-8">
                  <div className="p-2 bg-primary/10 rounded-full w-fit mb-4">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{persona.statement}"
                  </blockquote>
                  <div className="font-semibold">{persona.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6">
            See Your Own Resumes Scored
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Upload a resume, see how it scores against a job's real requirements, and watch
            it move through the pipeline from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={onGetStarted}
            >
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={onGetStarted}
            >
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm mt-6 opacity-70">
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-medium">HR</span>
              </div>
              <span className="font-semibold">Valt HR Suite</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Valt HR Suite, a Valtara AI product. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
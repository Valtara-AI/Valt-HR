import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  DollarSign,
  Play,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "./BrandLogo";
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "./ui/badge";
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
      title: "AI-Powered Assessments",
      description: "Advanced candidate evaluation with 95%+ accuracy using machine learning algorithms and behavioral analysis."
    },
    {
      icon: Target,
      iconColor: "icon-accent-2",
      title: "7-Phase Pipeline",
      description: "Complete recruitment workflow from sourcing to final interviews with automated progress tracking."
    },
    {
      icon: Users,
      iconColor: "icon-accent-3",
      title: "Smart Candidate Matching", 
      description: "Real-time profile comparison against job requirements with weighted scoring matrix."
    },
    {
      icon: Clock,
      iconColor: "icon-accent-4",
      title: "30% Faster Hiring",
      description: "Reduce time-to-hire from weeks to days with intelligent automation and parallel processing."
    },
    {
      icon: BarChart3,
      iconColor: "icon-accent-5",
      title: "Advanced Analytics",
      description: "Comprehensive insights with predictive analytics, conversion tracking, and performance metrics."
    },
    {
      icon: Shield,
      iconColor: "icon-accent-1",
      title: "Enterprise Security",
      description: "Bank-level security with compliance management and audit trails for sensitive HR data."
    }
  ];

  const benefits = [
    "70% reduction in manual HR tasks",
    "95%+ resume screening accuracy", 
    "Real-time pipeline visibility",
    "Automated interview scheduling",
    "Integrated CRM and notifications",
    "Predictive hiring success analytics"
  ];

  const testimonials = [
    {
      quote: "Transformed our hiring process completely. We're now hiring top talent 40% faster with better quality matches.",
      author: "Sarah Mitchell",
      role: "VP of Talent Acquisition",
      company: "TechFlow Inc"
    },
    {
      quote: "The AI assessments are incredibly accurate. We've seen a 60% improvement in new hire retention rates.",
      author: "Michael Chen", 
      role: "Head of HR",
      company: "InnovateCorp"
    },
    {
      quote: "Game-changing analytics. Finally have clear visibility into our recruitment ROI and bottlenecks.",
      author: "Emma Rodriguez",
      role: "Chief People Officer", 
      company: "ScaleUp Solutions"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Candidates Processed" },
    { value: "500+", label: "Companies Using" }, 
    { value: "95%", label: "Accuracy Rate" },
    { value: "30%", label: "Time Saved" }
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
          description: "Explore our comprehensive AI-powered recruitment tools"
        });
      }, 800);
    } else {
      toast.info("🚀 Comprehensive Features", {
        id: "features-nav",
        description: "• AI-Powered Assessments (95%+ accuracy)\n• 7-Phase Recruitment Pipeline\n• Smart Candidate Matching\n• 30% Faster Hiring Process\n• Advanced Analytics & Reporting\n• Enterprise Security & Compliance",
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
      toast.info("🏢 About Valt HR Suite", {
        id: "about-nav",
        description: "🚀 Founded: 2025 | Trusted by 500+ companies worldwide\n\n💼 Mission: Revolutionizing recruitment through AI-powered automation\n\n🎯 Key Achievements:\n• 10,000+ candidates processed successfully\n• 95% AI assessment accuracy rate\n• 30% average reduction in hiring time\n• 300% average ROI for clients\n\n🔧 Technology: Advanced machine learning, natural language processing, and predictive analytics\n\n🌟 Support: 24/7 customer success team\n📧 Contact: support@valthrsuite.com\n📞 Sales: +1 (555) 123-4567",
        duration: 12000,
        action: {
          label: "Learn More",
          onClick: () => {
            toast.success("Redirecting to company page...", {
              description: "Opening detailed company information and case studies"
            });
          }
        }
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden">
                <BrandLogo width={40} height={40} />
              </div>
              <div>
                <span className="font-semibold text-lg">Valt HR Suite</span>
                <Badge variant="secondary" className="ml-2">Premium</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
            <span className="text-sm font-medium">AI-Powered Recruitment Revolution</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 heading-text">
            Transform Your
            <br />
            <span className="gradient-text-primary">Hiring Process</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            End-to-end recruitment automation that reduces manual tasks by 70% while improving 
            candidate quality and hiring speed. From sourcing to onboarding, powered by AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
              <Play className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
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
            <h2 className="text-4xl font-semibold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to automate and optimize your recruitment process
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
                Why Choose Our
                <span className="text-primary"> HR Assistant?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Built for modern HR teams who demand efficiency, accuracy, and results. 
                Our platform combines cutting-edge AI with intuitive design.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 rounded-full">
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
                      <div className="font-semibold text-lg">ROI Impact</div>
                      <div className="text-muted-foreground">Average 300% return on investment</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Time Savings</div>
                      <div className="text-muted-foreground">18 days average time-to-hire</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Cost Reduction</div>
                      <div className="text-muted-foreground">$3,200 average cost per hire</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground">
              See what our customers say about transforming their hiring process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
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
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Join hundreds of companies already using our AI-powered recruitment platform. 
            Start your free trial today and see results in weeks, not months.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6"
              onClick={onGetStarted}
            >
              <Play className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-70">
            No credit card required • 14-day free trial • Cancel anytime
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
            © 2025 Valt HR Suite. All rights reserved. Built with AI for the future of recruitment.
          </div>
        </div>
      </footer>
    </div>
  );
}
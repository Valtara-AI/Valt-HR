import {
    ArrowLeft,
    Building2,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Shield,
    User,
    Users,
    Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface AuthPagesProps {
  onBack: () => void;
  onSignInSuccess: () => void;
}

export function AuthPages({ onBack, onSignInSuccess }: AuthPagesProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    company: "",
    role: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (authMode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        setIsLoading(false);
        return;
      }
      if (!formData.firstName || !formData.lastName || !formData.company) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }
    }

    // Simulate API call
    setTimeout(() => {
      if (authMode === "signin") {
        toast.success("Welcome back! Redirecting to dashboard...");
      } else {
        toast.success("Account created successfully! Redirecting to dashboard...");
      }
      setTimeout(() => {
        onSignInSuccess();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 lg:mb-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">HR</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text-primary">Valt HR Suite</h1>
                <p className="text-muted-foreground">Intelligent recruitment automation</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold heading-text">
              Transform Your Hiring Process
            </h2>
            <p className="text-lg body-text max-w-lg mx-auto lg:mx-0">
              Streamline recruitment with AI-powered candidate assessment, automated scheduling, 
              and comprehensive pipeline management.
            </p>

            <div className="grid gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <CheckCircle className="h-5 w-5 icon-accent-5 flex-shrink-0" />
                <span>7-Phase Automated Pipeline</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <Zap className="h-5 w-5 icon-accent-4 flex-shrink-0" />
                <span>AI-Powered Assessments</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <Users className="h-5 w-5 icon-accent-1 flex-shrink-0" />
                <span>Smart Interview Scheduling</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <Shield className="h-5 w-5 icon-accent-3 flex-shrink-0" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="h-3 w-3 mr-1" />
              500+ Companies
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              99.9% Uptime
            </Badge>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-2">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Button
                  variant={authMode === "signin" ? "default" : "ghost"}
                  onClick={() => setAuthMode("signin")}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button
                  variant={authMode === "signup" ? "default" : "ghost"}
                  onClick={() => setAuthMode("signup")}
                  className="flex-1"
                >
                  Sign Up
                </Button>
              </div>
              <CardTitle className="text-2xl text-center">
                {authMode === "signin" ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-center">
                {authMode === "signin" 
                  ? "Enter your credentials to access your dashboard" 
                  : "Join thousands of HR professionals streamlining their workflow"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="pl-9"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="company"
                          placeholder="Your Company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-9 pr-9"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {authMode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                )}

                {authMode === "signin" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Remember me</span>
                    </label>
                    <Button variant="link" className="px-0 text-sm">
                      Forgot password?
                    </Button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {authMode === "signin" ? "Signing in..." : "Creating account..."}
                    </div>
                  ) : (
                    authMode === "signin" ? "Sign In" : "Create Account"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </Button>
                </div>

                {authMode === "signup" && (
                  <p className="text-xs text-center text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Button variant="link" className="px-0 h-auto text-xs">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="px-0 h-auto text-xs">
                      Privacy Policy
                    </Button>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <Button 
              variant="link" 
              className="px-0 h-auto text-sm"
              onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
            >
              {authMode === "signin" ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
import {
  AlertCircle,
  Bell,
  Building,
  CheckCircle,
  Globe,
  Key,
  Palette,
  Save,
  Settings as SettingsIcon,
  Shield,
  User,
  Workflow
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function SettingsView() {
  // User Profile State
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    role: "HR Manager",
    department: "Human Resources",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York"
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNewCandidates: true,
    emailInterviewReminders: true,
    emailAssessmentComplete: false,
    pushNotifications: true,
    weeklyReports: true,
    instantUpdates: false
  });

  // Integration Settings State
  const [integrations, setIntegrations] = useState({
    workdayConnected: true,
    greenhouseConnected: false,
    slackConnected: true,
    emailProvider: "outlook",
    calendarSync: true
  });

  // Workflow Settings State
  const [workflowSettings, setWorkflowSettings] = useState({
    defaultPipeline: "standard-7-phase",
    autoAdvancePhases: false,
    requireApproval: true,
    defaultInterviewDuration: "60",
    assessmentTimeout: "45",
    candidateScoreThreshold: "75"
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "8",
    loginNotifications: true,
    dataRetention: "365"
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated!", {
      description: "Your profile information has been saved successfully."
    });
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!", {
      description: "Your notification settings have been updated."
    });
  };

  const handleConnectIntegration = (integration: string) => {
    if (integration === "greenhouse") {
      setIntegrations(prev => ({ ...prev, greenhouseConnected: true }));
      toast.success("Greenhouse connected!", {
        description: "Successfully connected to Greenhouse ATS platform."
      });
    }
  };

  const handleSaveWorkflow = () => {
    toast.success("Workflow settings saved!", {
      description: "Your workflow configuration has been updated."
    });
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved!", {
      description: "Your security preferences have been updated."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 icon-accent-1" />
        <div>
          <h2 className="text-2xl font-semibold heading-text">Settings</h2>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={profileData.role} onValueChange={(value) => setProfileData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR Manager">HR Manager</SelectItem>
                      <SelectItem value="HR Director">HR Director</SelectItem>
                      <SelectItem value="Recruiter">Recruiter</SelectItem>
                      <SelectItem value="Talent Acquisition Lead">Talent Acquisition Lead</SelectItem>
                      <SelectItem value="HR Business Partner">HR Business Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveProfile} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what email notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New candidate applications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new candidates apply</p>
                </div>
                <Switch
                  checked={notifications.emailNewCandidates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNewCandidates: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Interview reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders for upcoming interviews</p>
                </div>
                <Switch
                  checked={notifications.emailInterviewReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailInterviewReminders: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Assessment completion</Label>
                  <p className="text-sm text-muted-foreground">When candidates complete assessments</p>
                </div>
                <Switch
                  checked={notifications.emailAssessmentComplete}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailAssessmentComplete: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly reports</Label>
                  <p className="text-sm text-muted-foreground">Weekly analytics and progress reports</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Configure browser and mobile push notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable push notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive real-time notifications in your browser</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Instant updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified immediately for critical events</p>
                </div>
                <Switch
                  checked={notifications.instantUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, instantUpdates: checked }))}
                />
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveNotifications} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <ThemeToggle />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label>Accent Colors Preview</Label>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full icon-accent-1 bg-current"></div>
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full icon-accent-2 bg-current"></div>
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full icon-accent-3 bg-current"></div>
                    <span className="text-sm">Accent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full icon-accent-4 bg-current"></div>
                    <span className="text-sm">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full icon-accent-5 bg-current"></div>
                    <span className="text-sm">Success</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ATS Platform Integrations</CardTitle>
              <CardDescription>
                Connect your existing ATS platforms for seamless data sync
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 icon-accent-1" />
                  <div>
                    <Label>Workday</Label>
                    <p className="text-sm text-muted-foreground">Enterprise HCM platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integrations.workdayConnected ? (
                    <>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnectIntegration("workday")}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 icon-accent-2" />
                  <div>
                    <Label>Greenhouse</Label>
                    <p className="text-sm text-muted-foreground">Talent acquisition suite</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integrations.greenhouseConnected ? (
                    <>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnectIntegration("greenhouse")}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication Integrations</CardTitle>
              <CardDescription>
                Connect communication and productivity tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 icon-accent-3" />
                  <div>
                    <Label>Slack</Label>
                    <p className="text-sm text-muted-foreground">Team communication platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integrations.slackConnected ? (
                    <>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </>
                  ) : (
                    <Button size="sm">Connect</Button>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label>Email Provider</Label>
                <Select value={integrations.emailProvider} onValueChange={(value) => setIntegrations(prev => ({ ...prev, emailProvider: value }))}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="other">Other SMTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Calendar Sync</Label>
                  <p className="text-sm text-muted-foreground">Sync interview schedules with your calendar</p>
                </div>
                <Switch
                  checked={integrations.calendarSync}
                  onCheckedChange={(checked) => setIntegrations(prev => ({ ...prev, calendarSync: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Settings */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Configuration</CardTitle>
              <CardDescription>
                Configure your default recruitment pipeline settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Pipeline</Label>
                <Select value={workflowSettings.defaultPipeline} onValueChange={(value) => setWorkflowSettings(prev => ({ ...prev, defaultPipeline: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard-7-phase">Standard 7-Phase Pipeline</SelectItem>
                    <SelectItem value="fast-track-5-phase">Fast Track 5-Phase Pipeline</SelectItem>
                    <SelectItem value="executive-extended">Executive Extended Pipeline</SelectItem>
                    <SelectItem value="internship-simplified">Internship Simplified Pipeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-advance phases</Label>
                  <p className="text-sm text-muted-foreground">Automatically move candidates based on scores</p>
                </div>
                <Switch
                  checked={workflowSettings.autoAdvancePhases}
                  onCheckedChange={(checked) => setWorkflowSettings(prev => ({ ...prev, autoAdvancePhases: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require approval for advancement</Label>
                  <p className="text-sm text-muted-foreground">Manager approval needed to advance candidates</p>
                </div>
                <Switch
                  checked={workflowSettings.requireApproval}
                  onCheckedChange={(checked) => setWorkflowSettings(prev => ({ ...prev, requireApproval: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment & Interview Defaults</CardTitle>
              <CardDescription>
                Set default configurations for assessments and interviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Interview Duration (minutes)</Label>
                  <Select value={workflowSettings.defaultInterviewDuration} onValueChange={(value) => setWorkflowSettings(prev => ({ ...prev, defaultInterviewDuration: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Assessment Timeout (minutes)</Label>
                  <Select value={workflowSettings.assessmentTimeout} onValueChange={(value) => setWorkflowSettings(prev => ({ ...prev, assessmentTimeout: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="75">75 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Candidate Score Threshold (%)</Label>
                <Select value={workflowSettings.candidateScoreThreshold} onValueChange={(value) => setWorkflowSettings(prev => ({ ...prev, candidateScoreThreshold: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60% - Low threshold</SelectItem>
                    <SelectItem value="70">70% - Medium threshold</SelectItem>
                    <SelectItem value="75">75% - High threshold</SelectItem>
                    <SelectItem value="80">80% - Very high threshold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveWorkflow} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Workflow Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication & Access</CardTitle>
              <CardDescription>
                Manage your account security and authentication preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                  {!securitySettings.twoFactorEnabled && (
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-1" />
                      Setup
                    </Button>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Session Timeout (hours)</Label>
                <Select value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: value }))}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone signs into your account</p>
                </div>
                <Switch
                  checked={securitySettings.loginNotifications}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, loginNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Control how your data is handled and retained
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Retention Period (days)</Label>
                <Select value={securitySettings.dataRetention} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, dataRetention: value }))}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">365 days</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How long to retain candidate data after position closure
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <Label>Data Export & Deletion</Label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export My Data
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSecurity} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
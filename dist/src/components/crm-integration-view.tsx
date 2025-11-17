import {
    AlertCircle,
    Bell,
    CheckCircle,
    Database,
    ExternalLink,
    FileText,
    RefreshCw,
    Settings,
    Users,
    Zap
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";

interface CRMIntegrationViewProps {
  onOpenModal: (type: string) => void;
}

export function CRMIntegrationView({ onOpenModal }: CRMIntegrationViewProps) {
  const handleSync = (platform: string) => {
    toast.success(`Syncing with ${platform}...`, {
      description: "Data synchronization in progress"
    });
  };

  const handleNotificationToggle = (platform: string, enabled: boolean) => {
    toast.info(`Notifications ${enabled ? 'enabled' : 'disabled'} for ${platform}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">CRM Integration & Notification</h2>
          <p className="text-muted-foreground">Data population and stakeholder communication</p>
        </div>
        <Button onClick={() => onOpenModal("configure-integration")}>
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 icon-accent-1" />
              Workday Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Sync</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Records Synced</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sync Progress</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSync("Workday")}
                  className="flex-1"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync Now
                </Button>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 icon-accent-2" />
              Greenhouse Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Sync</span>
                <span className="text-sm text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Records Synced</span>
                <span className="font-medium">892</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sync Progress</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSync("Greenhouse")}
                  className="flex-1"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync Now
                </Button>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 icon-accent-3" />
              BambooHR Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Sync</span>
                <span className="text-sm text-muted-foreground">Never</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Records Synced</span>
                <span className="font-medium">0</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Setup Progress</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <Button size="sm" className="w-full">
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Population Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 icon-accent-4" />
            Data Population Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Complete Candidate Profiles</h4>
              <div className="text-2xl font-bold text-green-600">1,847</div>
              <p className="text-sm text-muted-foreground">With all assessment data</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Interview Summaries</h4>
              <div className="text-2xl font-bold text-blue-600">324</div>
              <p className="text-sm text-muted-foreground">With recommendations</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Skills Matrices</h4>
              <div className="text-2xl font-bold text-purple-600">1,205</div>
              <p className="text-sm text-muted-foreground">Cultural alignment scores</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Reference Checks</h4>
              <div className="text-2xl font-bold text-orange-600">156</div>
              <p className="text-sm text-muted-foreground">Completed with notes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stakeholder Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 icon-accent-5" />
            Stakeholder Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Notification Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Hiring Manager Alerts</span>
                  <Switch 
                    defaultChecked 
                    onCheckedChange={(checked) => handleNotificationToggle("Hiring Manager", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Pipeline Status Updates</span>
                  <Switch 
                    defaultChecked 
                    onCheckedChange={(checked) => handleNotificationToggle("Pipeline", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Interview Scheduling</span>
                  <Switch 
                    defaultChecked 
                    onCheckedChange={(checked) => handleNotificationToggle("Scheduling", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Candidate Reports</span>
                  <Switch 
                    onCheckedChange={(checked) => handleNotificationToggle("Reports", checked)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Recent Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Users className="h-4 w-4 mt-1 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Top candidate identified</p>
                    <p className="text-xs text-muted-foreground">Sarah Chen scored 94/100 for Senior Developer role</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-4 w-4 mt-1 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Interview completed</p>
                    <p className="text-xs text-muted-foreground">AI interview with Michael Rodriguez finished</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Zap className="h-4 w-4 mt-1 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pipeline metrics updated</p>
                    <p className="text-xs text-muted-foreground">Weekly recruitment report is ready</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
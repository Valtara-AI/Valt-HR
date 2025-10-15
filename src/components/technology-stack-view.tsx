import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle,
  Cloud,
  Cpu,
  Database,
  ExternalLink,
  Globe,
  Lock,
  MessageSquare,
  RefreshCw,
  Server,
  Settings,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TechnologyStackViewProps {
  onOpenModal: (type: string) => void;
}

export function TechnologyStackView({ onOpenModal }: TechnologyStackViewProps) {
  const handleStatusToggle = (service: string, enabled: boolean) => {
    toast.info(`${service} ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleConfigureService = (service: string) => {
    toast.info(`Opening ${service} configuration...`);
  };

  const handleHealthCheck = (service: string) => {
    toast.success(`Running health check for ${service}...`, {
      description: "System diagnostics in progress"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Technology Stack</h2>
          <p className="text-muted-foreground">Core systems, AI/ML components, and integrations</p>
        </div>
        <Button onClick={() => onOpenModal("configure-tech-stack")}>
          <Settings className="h-4 w-4 mr-2" />
          Configure Stack
        </Button>
      </div>

      <Tabs defaultValue="core" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="core">Core Systems</TabsTrigger>
          <TabsTrigger value="ai-ml">AI/ML Components</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-6">
          {/* ATS Integration Systems */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 icon-accent-1" />
                ATS Integration Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Workday</h4>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connection Status</span>
                      <span className="text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>API Version</span>
                      <span>v2.1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Sync</span>
                      <span>2 hours ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span>99.8%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleHealthCheck("Workday")}
                      className="flex-1"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleConfigureService("Workday")}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">Greenhouse</h4>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connection Status</span>
                      <span className="text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>API Version</span>
                      <span>v1.3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Sync</span>
                      <span>1 hour ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span>99.9%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleHealthCheck("Greenhouse")}
                      className="flex-1"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleConfigureService("Greenhouse")}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-orange-500" />
                      <h4 className="font-medium">BambooHR</h4>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Setup
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connection Status</span>
                      <span className="text-yellow-600">Configuring</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>API Version</span>
                      <span>v1.0</span>
                    </div>
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
              </div>
            </CardContent>
          </Card>

          {/* Communication & Video Platforms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 icon-accent-2" />
                Communication & Video Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Automated Email/SMS</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>SendGrid Integration</span>
                      <Switch 
                        defaultChecked 
                        onCheckedChange={(checked) => handleStatusToggle("SendGrid", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Twilio SMS</span>
                      <Switch 
                        defaultChecked 
                        onCheckedChange={(checked) => handleStatusToggle("Twilio", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Template Engine</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delivery Rate</span>
                      <span className="font-medium">98.7%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Video Interview Platforms</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Zoom Integration</span>
                      <Switch 
                        defaultChecked 
                        onCheckedChange={(checked) => handleStatusToggle("Zoom", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Microsoft Teams</span>
                      <Switch 
                        onCheckedChange={(checked) => handleStatusToggle("Teams", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Recording Storage</span>
                      <Badge className="bg-blue-100 text-blue-800">Cloud</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Sessions</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 icon-accent-3" />
                Analytics & Reporting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <p className="text-sm text-muted-foreground">Real-time Analytics</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">45+</div>
                  <p className="text-sm text-muted-foreground">KPI Metrics Tracked</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <p className="text-sm text-muted-foreground">Dashboard Views</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-orange-600">99.9%</div>
                  <p className="text-sm text-muted-foreground">Data Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-ml" className="space-y-6">
          {/* AI/ML Core Components */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 icon-accent-1" />
                AI/ML Core Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">Natural Language Processing</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resume Parsing Accuracy</span>
                      <span className="font-medium">96.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Language Models</span>
                      <span>GPT-4, BERT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Processing Speed</span>
                      <span>1.2s avg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Supported Languages</span>
                      <span>15+</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <h4 className="font-medium">Machine Learning Models</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Candidate Scoring Model</span>
                      <span className="font-medium">v2.1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prediction Accuracy</span>
                      <span>89.4%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Training Data Points</span>
                      <span>50K+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Model Update</span>
                      <span>3 days ago</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversational AI */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 icon-accent-2" />
                Conversational AI for Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Speech Recognition</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy Rate</span>
                      <span className="font-medium">94.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>{"< 2s"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accent Support</span>
                      <span>25+ dialects</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Sentiment Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Emotion Detection</span>
                      <span className="font-medium">91.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence Score</span>
                      <span>High</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Real-time Analysis</span>
                      <span>Enabled</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Question Generation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Adaptive Questions</span>
                      <span className="font-medium">500+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Context Awareness</span>
                      <span>Advanced</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Follow-up Logic</span>
                      <span>AI-driven</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Predictive Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 icon-accent-3" />
                Predictive Analytics Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Hiring Success Prediction</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Model Accuracy</span>
                      <span className="font-medium">87.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prediction Confidence</span>
                      <Progress value={87} className="w-24 h-2" />
                    </div>
                    <div className="flex justify-between">
                      <span>Data Features</span>
                      <span>42 variables</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="text-green-600">92%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Indicators</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Processing Capacity</span>
                      <span className="font-medium">1,000/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model Training Frequency</span>
                      <span>Weekly</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feature Engineering</span>
                      <span>Automated</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bias Detection</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {/* Security & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 icon-accent-1" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium">Data Encryption</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Encryption Standard</span>
                      <span>AES-256</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>At Rest</span>
                      <Badge className="bg-green-100 text-green-800">Encrypted</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>In Transit</span>
                      <Badge className="bg-green-100 text-green-800">TLS 1.3</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Key Management</span>
                      <span>AWS KMS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">Compliance</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>GDPR Compliance</span>
                      <Badge className="bg-green-100 text-green-800">Certified</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SOC 2 Type II</span>
                      <Badge className="bg-green-100 text-green-800">Certified</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CCPA Compliance</span>
                      <Badge className="bg-green-100 text-green-800">Certified</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Audit</span>
                      <span>3 months ago</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-500" />
                    <h4 className="font-medium">Access Control</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Multi-Factor Auth</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Role-Based Access</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Session Management</span>
                      <span>30 min timeout</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Audit Logging</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cloud Infrastructure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 icon-accent-2" />
                Cloud Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">AWS Services</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>EC2 Instances</span>
                      <Badge className="bg-green-100 text-green-800">12 Running</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>RDS Database</span>
                      <Badge className="bg-green-100 text-green-800">Multi-AZ</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>S3 Storage</span>
                      <span className="font-medium">2.4 TB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>CloudFront CDN</span>
                      <Badge className="bg-green-100 text-green-800">Global</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lambda Functions</span>
                      <span className="font-medium">24 Active</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Uptime</span>
                      <span className="font-medium text-green-600">99.97%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Response Time</span>
                      <span className="font-medium">{"< 200ms"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto Scaling</span>
                      <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Load Balancing</span>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backup Frequency</span>
                      <span className="font-medium">Every 6 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 icon-accent-3" />
                Third-Party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2 p-4 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto text-blue-500" />
                  <h4 className="font-medium">LinkedIn API</h4>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  <p className="text-xs text-muted-foreground">Candidate sourcing</p>
                </div>
                <div className="text-center space-y-2 p-4 border rounded-lg">
                  <Database className="h-8 w-8 mx-auto text-green-500" />
                  <h4 className="font-medium">Indeed API</h4>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  <p className="text-xs text-muted-foreground">Job posting</p>
                </div>
                <div className="text-center space-y-2 p-4 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto text-orange-500" />
                  <h4 className="font-medium">Glassdoor</h4>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  <p className="text-xs text-muted-foreground">Job distribution</p>
                </div>
                <div className="text-center space-y-2 p-4 border rounded-lg">
                  <MessageSquare className="h-8 w-8 mx-auto text-purple-500" />
                  <h4 className="font-medium">Slack</h4>
                  <Badge className="bg-yellow-100 text-yellow-800">Configuring</Badge>
                  <p className="text-xs text-muted-foreground">Team notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
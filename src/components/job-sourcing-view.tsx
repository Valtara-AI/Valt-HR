import {
    BarChart3,
    ExternalLink,
    Filter,
    Globe,
    RefreshCw,
    Search,
    Target,
    Users
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

interface JobSourcingProps {
  onOpenModal: (type: string) => void;
}

export function JobSourcingView({ onOpenModal }: JobSourcingProps) {
  const [activeTab, setActiveTab] = useState("linkedin");
  const [isScanning, setIsScanning] = useState(false);

  const handleStartSourcing = () => {
    setIsScanning(true);
    toast.info("Starting LinkedIn candidate sourcing...", {
      description: "Scanning profiles with role-specific keywords"
    });
    
    setTimeout(() => {
      setIsScanning(false);
      toast.success("Found 47 potential candidates!", {
        description: "23 exceptional fits, 15 strong candidates, 9 qualified with gaps"
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Candidate Sourcing & Job Posting</h2>
          <p className="text-muted-foreground">Phase 1: Automated sourcing and job distribution</p>
        </div>
        <Button onClick={() => onOpenModal("post-job")}>
          <Globe className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Sourcing Tabs */}
      <div className="flex space-x-1 border-b">
        {[
          { id: "linkedin", label: "LinkedIn Sourcing", icon: Users },
          { id: "jobboards", label: "Job Board Distribution", icon: Globe },
          { id: "matching", label: "Matching Algorithm", icon: Target }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* LinkedIn Sourcing Tab */}
      {activeTab === "linkedin" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 icon-accent-1" />
                  Active Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Senior Developer</span>
                    <Badge variant="secondary">Running</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Product Manager</span>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>UX Designer</span>
                    <Badge variant="outline">Queued</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Profiles Scanned</span>
                    <span className="font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Matches Found</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contacted</span>
                    <span className="font-medium">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Response Rate</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Score</span>
                    <span className="font-medium">8.7/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Time</span>
                    <span className="font-medium">12 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configure New Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Title</label>
                  <Input placeholder="e.g., Senior Software Engineer" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="san-francisco">San Francisco</SelectItem>
                      <SelectItem value="new-york">New York</SelectItem>
                      <SelectItem value="austin">Austin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Experience Level</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      <SelectItem value="lead">Lead (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Required Skills</label>
                <Input placeholder="React, TypeScript, Node.js, AWS" />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleStartSourcing} disabled={isScanning}>
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning LinkedIn...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start Sourcing
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job Board Distribution Tab */}
      {activeTab === "jobboards" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "LinkedIn Jobs", status: "active", posts: 12, applications: 89 },
              { name: "Indeed", status: "active", posts: 15, applications: 156 },
              { name: "Glassdoor", status: "active", posts: 8, applications: 67 },
              { name: "Company Site", status: "active", posts: 12, applications: 134 }
            ].map((board, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {board.name}
                    <Badge variant={board.status === "active" ? "default" : "secondary"}>
                      {board.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Posts</span>
                      <span className="font-medium">{board.posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Applications</span>
                      <span className="font-medium">{board.applications}</span>
                    </div>
                    <div className="pt-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        View Posts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Distribution Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Application Sources</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Indeed</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-16" />
                        <span className="text-sm">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Company Site</span>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="w-16" />
                        <span className="text-sm">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">LinkedIn</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-16" />
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Quality Score</span>
                      <span className="font-medium">7.8/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Interview Rate</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Offer Acceptance</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Cost Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cost per Application</span>
                      <span className="font-medium">$15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cost per Hire</span>
                      <span className="font-medium">$1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Budget</span>
                      <span className="font-medium">$12,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Matching Algorithm Tab */}
      {activeTab === "matching" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 icon-accent-2" />
                Real-time Matching Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-sm text-muted-foreground">Exceptional Fit</div>
                  <div className="text-xs text-muted-foreground">90-100% match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-muted-foreground">Strong Candidate</div>
                  <div className="text-xs text-muted-foreground">75-89% match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">9</div>
                  <div className="text-sm text-muted-foreground">Qualified w/ Gaps</div>
                  <div className="text-xs text-muted-foreground">60-74% match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <div className="text-sm text-muted-foreground">Not Qualified</div>
                  <div className="text-xs text-muted-foreground">Below 60% match</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Algorithm Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Matching Criteria Weights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Skills Match</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Experience Level</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Education</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Other Factors</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Accuracy Rate</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Speed</span>
                    <span className="font-medium">0.3s per profile</span>
                  </div>
                  <div className="flex justify-between">
                    <span>False Positives</span>
                    <span className="font-medium">3.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Confidence</span>
                    <span className="font-medium">96.7%</span>
                  </div>
                  <Separator />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      toast.info("Opening detailed analytics...", {
                        description: "Comprehensive job sourcing metrics and insights"
                      });
                    }}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
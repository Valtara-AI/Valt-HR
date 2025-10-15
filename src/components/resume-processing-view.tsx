import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileText,
    Filter,
    RotateCcw,
    Users,
    XCircle,
    Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface ResumeProcessingProps {
  onOpenModal: (type: string) => void;
}

export function ResumeProcessingView({ onOpenModal }: ResumeProcessingProps) {
  const [processingStatus, setProcessingStatus] = useState("idle");

  const handleProcessBatch = () => {
    setProcessingStatus("processing");
    toast.info("Processing new applications...", {
      description: "Parsing resumes and validating data"
    });
    
    setTimeout(() => {
      setProcessingStatus("completed");
      toast.success("Batch processing completed!", {
        description: "47 resumes parsed, 3 duplicates detected, 2 validation errors"
      });
    }, 3000);
  };

  const recentApplications = [
    {
      id: "APP-001",
      name: "Sarah Chen",
      position: "Senior Developer",
      status: "parsed",
      score: 94,
      duplicates: 0,
      errors: 0,
      timestamp: "2 min ago"
    },
    {
      id: "APP-002", 
      name: "Michael Rodriguez",
      position: "Product Manager",
      status: "validation_error",
      score: 0,
      duplicates: 0,
      errors: 1,
      timestamp: "5 min ago"
    },
    {
      id: "APP-003",
      name: "Emma Davis",
      position: "UX Designer", 
      status: "duplicate_detected",
      score: 87,
      duplicates: 1,
      errors: 0,
      timestamp: "8 min ago"
    },
    {
      id: "APP-004",
      name: "David Wilson",
      position: "Senior Developer",
      status: "parsed",
      score: 91,
      duplicates: 0, 
      errors: 0,
      timestamp: "12 min ago"
    },
    {
      id: "APP-005",
      name: "Lisa Thompson",
      position: "Marketing Manager",
      status: "categorized",
      score: 78,
      duplicates: 0,
      errors: 0,
      timestamp: "15 min ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "parsed":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Parsed</Badge>;
      case "validation_error":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
      case "duplicate_detected":
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Duplicate</Badge>;
      case "categorized":
        return <Badge variant="outline"><Users className="h-3 w-3 mr-1" />Categorized</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Application Processing</h2>
          <p className="text-muted-foreground">Phase 2: Resume parsing, validation & categorization</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleProcessBatch} disabled={processingStatus === "processing"}>
            {processingStatus === "processing" ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Process New Batch
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => onOpenModal("upload-resume")}>
            <FileText className="h-4 w-4 mr-2" />
            Upload Resume
          </Button>
        </div>
      </div>

      {/* Processing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 icon-accent-1" />
              Today's Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-sm text-muted-foreground">Applications received</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span>Processed</span>
                <span>89%</span>
              </div>
              <Progress value={89} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 icon-accent-2" />
              Parsing Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95.2%</div>
            <p className="text-sm text-muted-foreground">Success rate</p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Successful</span>
                <span>235</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Failed</span>
                <span>12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 icon-accent-3" />
              Duplicates Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-sm text-muted-foreground">Duplicate applications</p>
            <div className="mt-2">
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="h-3 w-3 mr-2" />
                Review Duplicates
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 icon-accent-4" />
              Avg. Process Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-sm text-muted-foreground">Per application</p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Resume parsing</span>
                <span>1.2s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Validation</span>
                <span>0.8s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Categorization</span>
                <span>0.3s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Pipeline Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium">Resume Parsing</h4>
              <p className="text-sm text-muted-foreground">Extract structured data</p>
              <div className="mt-2">
                <Badge variant="outline">Active: 12</Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium">Validation</h4>
              <p className="text-sm text-muted-foreground">Verify completeness</p>
              <div className="mt-2">
                <Badge variant="outline">Queue: 8</Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-medium">Duplicate Detection</h4>
              <p className="text-sm text-muted-foreground">Identify matches</p>
              <div className="mt-2">
                <Badge variant="outline">Found: 3</Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium">Categorization</h4>
              <p className="text-sm text-muted-foreground">Sort by role fit</p>
              <div className="mt-2">
                <Badge variant="outline">Completed: 235</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Applications</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Parse Score</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono text-sm">{app.id}</TableCell>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.position}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>
                    {app.score > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{app.score}/100</span>
                        <Progress value={app.score} className="w-16" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {app.duplicates > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {app.duplicates} Dup
                        </Badge>
                      )}
                      {app.errors > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {app.errors} Err
                        </Badge>
                      )}
                      {app.duplicates === 0 && app.errors === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Clean
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {app.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {app.status === "validation_error" && (
                        <Button size="sm" variant="outline">
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Parsing Accuracy Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Extraction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Contact Information</span>
                  <span className="text-sm font-medium">98.5%</span>
                </div>
                <Progress value={98.5} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Work Experience</span>
                  <span className="text-sm font-medium">95.2%</span>
                </div>
                <Progress value={95.2} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Skills & Technologies</span>
                  <span className="text-sm font-medium">92.8%</span>
                </div>
                <Progress value={92.8} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Education</span>
                  <span className="text-sm font-medium">96.7%</span>
                </div>
                <Progress value={96.7} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorization Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Exceptional Fit (90-100%)</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">89</Badge>
                  <span className="text-sm text-muted-foreground">36%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Strong Candidate (75-89%)</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500">67</Badge>
                  <span className="text-sm text-muted-foreground">27%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Qualified w/ Gaps (60-74%)</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500">54</Badge>
                  <span className="text-sm text-muted-foreground">22%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Not Qualified ({"< 60%"})</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">37</Badge>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
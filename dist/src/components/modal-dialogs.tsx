import {
  Calendar,
  Download,
  FileText,
  Upload,
  UserPlus,
  Users
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

type FormData = {
  jobTitle?: string;
  department?: string;
  description?: string;
  candidate?: string;
  interviewer?: string;
  date?: string;
  time?: string;
  assessmentName?: string;
  type?: string;
  duration?: string | number;
  newHire?: string;
  startDate?: string;
  buddy?: string;
  reportType?: string;
  format?: string;
  dateFrom?: string;
  dateTo?: string;
  candidateName?: string;
  email?: string;
  position?: string;
  // any other dynamic fields
  [key: string]: unknown;
};

interface ModalDialogsProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  onConfirm?: (data?: FormData) => void;
}

export function ModalDialogs({ isOpen, onClose, type, onConfirm }: ModalDialogsProps) {
  const [formData, setFormData] = useState<FormData>({});

  const handleSubmit = () => {
    onConfirm?.(formData);
    onClose();
    setFormData({});
  };

  const renderContent = () => {
    switch (type) {
      case "post-job":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Post New Job
              </DialogTitle>
              <DialogDescription>
                Create a new job posting and start the recruitment process.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.jobTitle || ""}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Post Job</Button>
            </DialogFooter>
          </>
        );

      case "schedule-interview":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Interview
              </DialogTitle>
              <DialogDescription>
                Schedule an interview with the selected candidate.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="candidate">Candidate</Label>
                <Select onValueChange={(value) => setFormData({...formData, candidate: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah-chen">Sarah Chen - Senior Frontend Developer</SelectItem>
                    <SelectItem value="michael-rodriguez">Michael Rodriguez - Product Manager</SelectItem>
                    <SelectItem value="emma-davis">Emma Davis - UX Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interviewer">Interviewer</Label>
                <Select onValueChange={(value) => setFormData({...formData, interviewer: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith - Engineering Manager</SelectItem>
                    <SelectItem value="jane-doe">Jane Doe - Senior Developer</SelectItem>
                    <SelectItem value="bob-wilson">Bob Wilson - Design Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input 
                    id="time" 
                    type="time"
                    value={formData.time || ""}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Schedule Interview</Button>
            </DialogFooter>
          </>
        );

      case "create-assessment":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Create Assessment
              </DialogTitle>
              <DialogDescription>
                Create a new AI-powered assessment for candidates.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assessmentName">Assessment Name</Label>
                <Input 
                  id="assessmentName" 
                  placeholder="e.g. Frontend Developer Skills Test"
                  value={formData.assessmentName || ""}
                  onChange={(e) => setFormData({...formData, assessmentName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Assessment Type</Label>
                <Select onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Skills</SelectItem>
                    <SelectItem value="cognitive">Cognitive Ability</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="cultural">Cultural Fit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  placeholder="45"
                  value={formData.duration || ""}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Create Assessment</Button>
            </DialogFooter>
          </>
        );

      case "start-onboarding":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Start Onboarding
              </DialogTitle>
              <DialogDescription>
                Begin the onboarding process for a new hire.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newHire">New Hire</Label>
                <Select onValueChange={(value) => setFormData({...formData, newHire: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new hire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alex-thompson">Alex Thompson - Data Scientist</SelectItem>
                    <SelectItem value="lisa-wang">Lisa Wang - Backend Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buddy">Assigned Buddy</Label>
                <Select onValueChange={(value) => setFormData({...formData, buddy: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select buddy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah-chen">Sarah Chen</SelectItem>
                    <SelectItem value="michael-rodriguez">Michael Rodriguez</SelectItem>
                    <SelectItem value="emma-davis">Emma Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Start Onboarding</Button>
            </DialogFooter>
          </>
        );

      case "export-report":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Report
              </DialogTitle>
              <DialogDescription>
                Generate and download a comprehensive report.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select onValueChange={(value) => setFormData({...formData, reportType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pipeline">Pipeline Analysis</SelectItem>
                    <SelectItem value="candidates">Candidate Summary</SelectItem>
                    <SelectItem value="performance">Performance Metrics</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select onValueChange={(value) => setFormData({...formData, format: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input 
                    id="dateFrom" 
                    type="date"
                    value={formData.dateFrom || ""}
                    onChange={(e) => setFormData({...formData, dateFrom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input 
                    id="dateTo" 
                    type="date"
                    value={formData.dateTo || ""}
                    onChange={(e) => setFormData({...formData, dateTo: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogFooter>
          </>
        );

      case "add-candidate":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Add Candidate
              </DialogTitle>
              <DialogDescription>
                Add a new candidate to the recruitment pipeline.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="candidateName">Full Name</Label>
                <Input 
                  id="candidateName" 
                  placeholder="e.g. John Doe"
                  value={formData.candidateName || ""}
                  onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="john.doe@email.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select onValueChange={(value) => setFormData({...formData, position: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend-dev">Frontend Developer</SelectItem>
                    <SelectItem value="backend-dev">Backend Developer</SelectItem>
                    <SelectItem value="product-manager">Product Manager</SelectItem>
                    <SelectItem value="ux-designer">UX Designer</SelectItem>
                    <SelectItem value="data-scientist">Data Scientist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC up to 10MB</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Add Candidate</Button>
            </DialogFooter>
          </>
        );

      default:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to perform this action?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Confirm</Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // When the dialog is closed (open === false) call onClose
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
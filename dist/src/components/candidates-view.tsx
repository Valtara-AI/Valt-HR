import {
    Calendar,
    FileText,
    Filter,
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
    Search,
    User
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CandidatesViewProps {
  onOpenModal: (type: string) => void;
}

export function CandidatesView({ onOpenModal }: CandidatesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");

  const candidates = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Frontend Developer",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      stage: "Assessment",
      score: 95,
      rating: "Exceptional",
      avatar: null,
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      experience: "5 years",
      education: "MS Computer Science",
      appliedDate: "2024-09-10",
      lastContact: "2024-09-15",
      status: "active"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Product Manager",
      email: "m.rodriguez@email.com",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      stage: "Interview",
      score: 87,
      rating: "Strong",
      avatar: null,
      skills: ["Product Strategy", "Analytics", "Agile", "Leadership"],
      experience: "7 years",
      education: "MBA, BS Engineering",
      appliedDate: "2024-09-08",
      lastContact: "2024-09-14",
      status: "active"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "UX Designer",
      email: "emma.davis@email.com",
      phone: "+1 (555) 345-6789",
      location: "Seattle, WA",
      stage: "Screening",
      score: 82,
      rating: "Strong",
      avatar: null,
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      experience: "4 years",
      education: "BFA Design",
      appliedDate: "2024-09-12",
      lastContact: "2024-09-16",
      status: "active"
    },
    {
      id: 4,
      name: "Alex Thompson",
      role: "Data Scientist",
      email: "alex.thompson@email.com",
      phone: "+1 (555) 456-7890",
      location: "Boston, MA",
      stage: "Final Review",
      score: 92,
      rating: "Exceptional",
      avatar: null,
      skills: ["Python", "Machine Learning", "SQL", "Statistics"],
      experience: "6 years",
      education: "PhD Data Science",
      appliedDate: "2024-09-05",
      lastContact: "2024-09-15",
      status: "active"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Backend Developer",
      email: "lisa.wang@email.com",
      phone: "+1 (555) 567-8901",
      location: "New York, NY",
      stage: "Offer",
      score: 89,
      rating: "Strong",
      avatar: null,
      skills: ["Java", "Spring", "Microservices", "Docker"],
      experience: "5 years",
      education: "MS Software Engineering",
      appliedDate: "2024-09-01",
      lastContact: "2024-09-16",
      status: "pending_offer"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 75) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Sourcing": return "outline";
      case "Screening": return "secondary";
      case "Assessment": return "default";
      case "Interview": return "default";
      case "Final Review": return "secondary";
      case "Offer": return "default";
      default: return "outline";
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === "all" || candidate.stage.toLowerCase() === filterStage.toLowerCase();
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Candidates</h2>
          <p className="text-muted-foreground">{candidates.length} total candidates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenModal("export-report")}>Export</Button>
          <Button onClick={() => onOpenModal("add-candidate")}>Add Candidate</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search candidates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="sourcing">Sourcing</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="final review">Final Review</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.avatar || undefined} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{candidate.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score and Rating */}
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.score)}`}>
                  Score: {candidate.score}/100
                </div>
                <Badge variant={getStageColor(candidate.stage)}>
                  {candidate.stage}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{candidate.location}</span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-medium mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Experience and Education */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-medium">{candidate.experience}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Education</p>
                  <p className="font-medium truncate">{candidate.education}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Applied {candidate.appliedDate}</span>
                </div>
                <span>Last contact {candidate.lastContact}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toast.success("Resume opened in new tab")}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Resume
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onOpenModal("schedule-interview")}
                >
                  Schedule Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">12</p>
              <p className="text-sm text-muted-foreground">Exceptional (90+)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">18</p>
              <p className="text-sm text-muted-foreground">Strong (75-89)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-orange-600">15</p>
              <p className="text-sm text-muted-foreground">Qualified (60-74)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-red-600">8</p>
              <p className="text-sm text-muted-foreground">Below Threshold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">18 days</p>
              <p className="text-sm text-muted-foreground">Avg. Time in Pipeline</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
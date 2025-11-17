import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Link2,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Settings,
  Video
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface SchedulingViewProps {
  onOpenModal: (type: string) => void;
}

const todayInterviews = [
  {
    id: 1,
    candidate: "Sarah Chen",
    role: "Senior Developer",
    time: "10:00 AM",
    duration: "45 min",
    interviewer: "John Smith",
    type: "Video",
    status: "confirmed",
    location: "Zoom Room 1"
  },
  {
    id: 2,
    candidate: "Michael Rodriguez",
    role: "Product Manager",
    time: "2:00 PM",
    duration: "60 min",
    interviewer: "Jane Doe",
    type: "In-person",
    status: "confirmed",
    location: "Conference Room A"
  },
  {
    id: 3,
    candidate: "Emma Davis",
    role: "UX Designer",
    time: "4:30 PM",
    duration: "45 min",
    interviewer: "Bob Wilson",
    type: "Video",
    status: "pending",
    location: "Teams Meeting"
  }
];

const upcomingInterviews = [
  {
    date: "Tomorrow",
    interviews: [
      { candidate: "James Wilson", role: "Data Scientist", time: "10:00 AM", interviewer: "Alice Johnson", type: "Video" },
      { candidate: "Lisa Thompson", role: "Backend Dev", time: "2:30 PM", interviewer: "Tom Brown", type: "In-person" }
    ]
  },
  {
    date: "Friday",
    interviews: [
      { candidate: "Kevin Lee", role: "DevOps Engineer", time: "11:00 AM", interviewer: "Mary Davis", type: "Video" },
      { candidate: "Sophie Martin", role: "Frontend Dev", time: "3:00 PM", interviewer: "Chris Wilson", type: "Video" },
      { candidate: "Alex Turner", role: "Full Stack", time: "4:00 PM", interviewer: "Sarah Kim", type: "In-person" }
    ]
  }
];

export function SchedulingView({ onOpenModal }: SchedulingViewProps) {
  const [activeTab, setActiveTab] = useState("today");
  const [viewMode, setViewMode] = useState("list");
  const [filterType, setFilterType] = useState("all");

  const handleJoinMeeting = (candidate: string, location: string) => {
    toast.success(`Joining meeting with ${candidate}...`, {
      description: `Opening ${location}`
    });
  };

  const handleSendReminder = (candidate: string) => {
    toast.success(`Reminder sent to ${candidate}`, {
      description: "Interview confirmation and details shared"
    });
  };

  const handleReschedule = (candidate: string) => {
    toast.info(`Rescheduling interview with ${candidate}...`, {
      description: "Opening calendar to select new time"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Interview Scheduling</h2>
          <p className="text-muted-foreground">Phase 7: Automated calendar coordination and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Opening calendar integration...")}>
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button onClick={() => onOpenModal("schedule-interview")}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Interviews</CardTitle>
            <Calendar className="h-4 w-4 icon-accent-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 video, 5 in-person</p>
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">All confirmed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 icon-accent-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">Scheduled interviews</p>
            <Progress value={78} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">78% capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 icon-accent-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">↑ 4% vs last week</p>
            <Badge className="bg-green-100 text-green-800 mt-2">Excellent</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 icon-accent-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3%</div>
            <p className="text-xs text-muted-foreground">Below target (5%)</p>
            <Badge className="bg-green-100 text-green-800 mt-2">On Track</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar Integration</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video Only</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="today" className="space-y-6">
          {/* Today's Interview List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 icon-accent-1" />
                Today's Interview Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayInterviews.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-muted-foreground">{interview.time}</div>
                        <h4 className="font-medium">{interview.candidate}</h4>
                        <Badge variant="outline">{interview.role}</Badge>
                        <Badge variant={interview.type === "Video" ? "default" : "secondary"}>
                          {interview.type === "Video" ? (
                            <Video className="h-3 w-3 mr-1" />
                          ) : interview.type === "Phone" ? (
                            <Phone className="h-3 w-3 mr-1" />
                          ) : (
                            <MapPin className="h-3 w-3 mr-1" />
                          )}
                          {interview.type}
                        </Badge>
                        <Badge variant={interview.status === "confirmed" ? "default" : "outline"}>
                          {interview.status === "confirmed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {interview.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 font-medium">{interview.duration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Interviewer:</span>
                          <span className="ml-2 font-medium">{interview.interviewer}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <span className="ml-2 font-medium">{interview.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {interview.type === "Video" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinMeeting(interview.candidate, interview.location)}
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Join Meeting
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSendReminder(interview.candidate)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        Remind
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleReschedule(interview.candidate)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interview Packet Preparation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 icon-accent-2" />
                Interview Packet Preparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayInterviews.map((interview) => (
                  <div key={interview.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{interview.candidate}</h4>
                        <p className="text-sm text-muted-foreground">{interview.time}</p>
                      </div>
                      <Badge variant={interview.status === "confirmed" ? "default" : "outline"}>
                        {interview.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Candidate Summary</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Interview Questions</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Evaluation Forms</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="space-y-6">
            {upcomingInterviews.map((day, dayIndex) => (
              <Card key={dayIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 icon-accent-1" />
                    {day.date} - {day.interviews.length} Interview{day.interviews.length !== 1 ? 's' : ''}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.interviews.map((interview, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-muted-foreground">{interview.time}</div>
                            <h4 className="font-medium">{interview.candidate}</h4>
                            <Badge variant="outline">{interview.role}</Badge>
                            <Badge variant={interview.type === "Video" ? "default" : "secondary"}>
                              {interview.type === "Video" ? (
                                <Video className="h-3 w-3 mr-1" />
                              ) : (
                                <MapPin className="h-3 w-3 mr-1" />
                              )}
                              {interview.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            with {interview.interviewer}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Bell className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weekly Schedule Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {[
                  { day: "Mon", interviews: 6, capacity: 8 },
                  { day: "Tue", interviews: 8, capacity: 8 },
                  { day: "Wed", interviews: 5, capacity: 8 },
                  { day: "Thu", interviews: 7, capacity: 8 },
                  { day: "Fri", interviews: 6, capacity: 8 },
                  { day: "Sat", interviews: 0, capacity: 8 },
                  { day: "Sun", interviews: 0, capacity: 8 }
                ].map((day, index) => (
                  <div key={index} className="text-center p-3 border rounded-lg">
                    <div className="font-medium">{day.day}</div>
                    <div className="text-2xl font-bold mt-2">{day.interviews}</div>
                    <div className="text-xs text-muted-foreground">of {day.capacity}</div>
                    <Progress 
                      value={(day.interviews / day.capacity) * 100} 
                      className="mt-2 h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          {/* Calendar Integration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 icon-accent-1" />
                Calendar Integration Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Connected Platforms</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span>Google Calendar</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span>Microsoft Outlook</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        <span>Zoom Integration</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                        <span>Microsoft Teams</span>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Automation Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Auto-send invitations</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reminder notifications</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Conflict detection</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-reschedule conflicts</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Conference Rooms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 icon-accent-2" />
                Video Conference Room Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Zoom Room 1", status: "available", nextMeeting: "2:00 PM", capacity: 25 },
                  { name: "Zoom Room 2", status: "in-use", nextMeeting: "Now - 11:30 AM", capacity: 50 },
                  { name: "Teams Room A", status: "available", nextMeeting: "4:30 PM", capacity: 10 },
                  { name: "Teams Room B", status: "maintenance", nextMeeting: "Unavailable", capacity: 15 },
                  { name: "Zoom Room 3", status: "available", nextMeeting: "Tomorrow 9:00 AM", capacity: 100 },
                  { name: "Google Meet", status: "available", nextMeeting: "3:00 PM", capacity: 250 }
                ].map((room, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{room.name}</h4>
                      <Badge variant={
                        room.status === "available" ? "default" :
                        room.status === "in-use" ? "secondary" : "destructive"
                      }>
                        <div className={`h-2 w-2 rounded-full mr-1 ${
                          room.status === "available" ? "bg-green-500" :
                          room.status === "in-use" ? "bg-yellow-500" : "bg-red-500"
                        }`}></div>
                        {room.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">Next meeting:</span>
                        <span className="ml-2">{room.nextMeeting}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="ml-2">{room.capacity} participants</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3" disabled={room.status !== "available"}>
                      <Link2 className="h-3 w-3 mr-1" />
                      Get Link
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduling Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduling Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">98%</div>
                  <p className="text-sm text-muted-foreground">On-time Rate</p>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">2.3min</div>
                  <p className="text-sm text-muted-foreground">Avg. Setup Time</p>
                  <Badge className="bg-blue-100 text-blue-800">Fast</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">8%</div>
                  <p className="text-sm text-muted-foreground">Reschedule Rate</p>
                  <Badge className="bg-purple-100 text-purple-800">Normal</Badge>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">96%</div>
                  <p className="text-sm text-muted-foreground">Auto-scheduling Success</p>
                  <Badge className="bg-orange-100 text-orange-800">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
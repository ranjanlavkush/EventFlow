import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Bell, Download } from "lucide-react";
import { type Language, useTranslation } from "@/lib/i18n";

interface CountdownTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface ScholarshipTimeline {
  id: string;
  name: string;
  phases: {
    name: string;
    date: string;
    status: 'completed' | 'active' | 'upcoming';
    description: string;
  }[];
}

const scholarshipTimelines: ScholarshipTimeline[] = [
  {
    id: "pre-matric-sc-st",
    name: "Pre-Matric Scholarship for SC/ST Students",
    phases: [
      {
        name: "Application Period",
        date: "2024-01-15 to 2024-03-31",
        status: "completed",
        description: "Online application submission period"
      },
      {
        name: "Document Verification",
        date: "2024-04-01 to 2024-04-30",
        status: "active",
        description: "Verification of submitted documents by authorities"
      },
      {
        name: "Approval & Sanction",
        date: "2024-05-01 to 2024-05-31",
        status: "upcoming",
        description: "Final approval and scholarship amount sanctioning"
      },
      {
        name: "Fund Disbursement",
        date: "2024-06-01 to 2024-06-15",
        status: "upcoming",
        description: "Direct transfer to DBT-enabled bank accounts"
      }
    ]
  },
  {
    id: "post-matric-obc",
    name: "Post-Matric Scholarship for OBC Students",
    phases: [
      {
        name: "Application Period",
        date: "2024-02-01 to 2024-04-30",
        status: "active",
        description: "Online application submission period"
      },
      {
        name: "Document Verification",
        date: "2024-05-01 to 2024-05-31",
        status: "upcoming",
        description: "Verification of submitted documents by authorities"
      },
      {
        name: "Merit List Preparation",
        date: "2024-06-01 to 2024-06-15",
        status: "upcoming",
        description: "Preparation of merit-based selection list"
      },
      {
        name: "Fund Disbursement",
        date: "2024-07-01 to 2024-07-15",
        status: "upcoming",
        description: "Direct transfer to DBT-enabled bank accounts"
      }
    ]
  }
];

export default function CountdownTracker({ isOpen, onClose, language }: CountdownTrackerProps) {
  const [selectedTimeline, setSelectedTimeline] = useState(scholarshipTimelines[0]);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, string>>({});
  const t = useTranslation(language);

  useEffect(() => {
    const updateCountdown = () => {
      const newTimeRemaining: Record<string, string> = {};
      
      scholarshipTimelines.forEach(timeline => {
        timeline.phases.forEach(phase => {
          if (phase.status === 'active' || phase.status === 'upcoming') {
            const endDate = new Date(phase.date.split(' to ')[1] || phase.date);
            const now = new Date();
            const difference = endDate.getTime() - now.getTime();
            
            if (difference > 0) {
              const days = Math.floor(difference / (1000 * 60 * 60 * 24));
              const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
              
              newTimeRemaining[`${timeline.id}-${phase.name}`] = `${days}d ${hours}h ${minutes}m`;
            } else {
              newTimeRemaining[`${timeline.id}-${phase.name}`] = "Expired";
            }
          }
        });
      });
      
      setTimeRemaining(newTimeRemaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'upcoming':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'active':
        return '🔄';
      case 'upcoming':
        return '⏳';
      default:
        return '📅';
    }
  };

  const generateCalendarEvent = (phase: any) => {
    const startDate = new Date(phase.date.split(' to ')[0]);
    const endDate = new Date(phase.date.split(' to ')[1] || phase.date);
    
    const calendarEvent = {
      title: `${selectedTimeline.name} - ${phase.name}`,
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: phase.description
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${calendarEvent.start}/${calendarEvent.end}&details=${encodeURIComponent(calendarEvent.description)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="countdown-tracker">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="text-primary" />
            Scholarship Timeline Tracker
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scholarship Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold">Select Scholarship</h3>
            {scholarshipTimelines.map((timeline) => (
              <Card 
                key={timeline.id}
                className={`cursor-pointer transition-colors ${
                  selectedTimeline.id === timeline.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedTimeline(timeline)}
                data-testid={`timeline-${timeline.id}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{timeline.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>{timeline.phases.length} phases</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Timeline Display */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{selectedTimeline.name}</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateCalendarEvent(selectedTimeline.phases.find(p => p.status === 'active' || p.status === 'upcoming'))}
                data-testid="add-to-calendar-button"
              >
                <Calendar className="mr-2" size={14} />
                Add to Calendar
              </Button>
            </div>

            <div className="space-y-4">
              {selectedTimeline.phases.map((phase, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(phase.status)}</span>
                        <span>{phase.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                        {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      <span>{phase.date}</span>
                    </div>
                    
                    <p className="text-sm">{phase.description}</p>
                    
                    {(phase.status === 'active' || phase.status === 'upcoming') && 
                     timeRemaining[`${selectedTimeline.id}-${phase.name}`] && (
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm font-medium text-accent">
                          <Clock size={14} />
                          <span>
                            {phase.status === 'active' ? 'Time Remaining: ' : 'Starts in: '}
                            {timeRemaining[`${selectedTimeline.id}-${phase.name}`]}
                          </span>
                        </div>
                      </div>
                    )}

                    {phase.status === 'active' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => generateCalendarEvent(phase)}
                          data-testid="set-reminder-button"
                        >
                          <Bell className="mr-2" size={12} />
                          Set Reminder
                        </Button>
                      </div>
                    )}
                  </CardContent>

                  {/* Progress Line */}
                  {index < selectedTimeline.phases.length - 1 && (
                    <div className="absolute left-6 top-full w-0.5 h-4 bg-border"></div>
                  )}
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" data-testid="download-timeline-button">
                    <Download className="mr-2" size={14} />
                    Download Timeline
                  </Button>
                  <Button variant="outline" size="sm" data-testid="check-status-button">
                    <Clock className="mr-2" size={14} />
                    Check Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

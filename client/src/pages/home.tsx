import { useState } from "react";
import { GraduationCap, UserCheck, Dock, MapPin, Gamepad2, Calendar, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EligibilityWizard from "@/components/eligibility-wizard";
import DBTSimulator from "@/components/dbt-simulator";
import HelpCenterMap from "@/components/help-center-map";
import GamifiedLearning from "@/components/gamified-learning";
import CountdownTracker from "@/components/countdown-tracker";
import ParentToolkit from "@/components/parent-toolkit";
import AIchatAssistant from "@/components/ai-chat-assistant";
import VideoSection from "@/components/video-section";
import WhatsAppIntegration from "@/components/whatsapp-integration";
import { type Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [eligibilityWizardOpen, setEligibilityWizardOpen] = useState(false);
  const [dbtSimulatorOpen, setDBTSimulatorOpen] = useState(false);
  const [helpCenterMapOpen, setHelpCenterMapOpen] = useState(false);
  const [gamifiedLearningOpen, setGamifiedLearningOpen] = useState(false);
  const [countdownTrackerOpen, setCountdownTrackerOpen] = useState(false);
  const [parentToolkitOpen, setParentToolkitOpen] = useState(false);
  const [chatAssistantOpen, setChatAssistantOpen] = useState(false);
  const t = useTranslation(language);

  const stats = [
    { value: "50,000+", label: "Students Helped" },
    { value: "₹500Cr+", label: "Scholarships Unlocked" },
    { value: "24/7", label: "AI Support" },
    { value: "4", label: "Languages" }
  ];

  const services = [
    {
      icon: UserCheck,
      title: "Smart Eligibility Wizard",
      description: "Answer a few questions to discover all scholarships you're eligible for with our intelligent matching system.",
      color: "bg-primary/10 text-primary",
      buttonColor: "bg-primary hover:bg-primary/90 text-primary-foreground",
      onClick: () => setEligibilityWizardOpen(true),
      testId: "eligibility-wizard-trigger"
    },
    {
      icon: Dock,
      title: "DBT Status Simulator",
      description: "Practice checking your DBT seeding status with our realistic simulation of bank and UIDAI portals.",
      color: "bg-secondary/10 text-secondary",
      buttonColor: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
      onClick: () => setDBTSimulatorOpen(true),
      testId: "dbt-simulator-trigger"
    },
    {
      icon: MapPin,
      title: "Find Help Centers",
      description: "Locate nearby banks, CSCs, and UIDAI offices for Aadhaar seeding assistance with directions and contact info.",
      color: "bg-accent/10 text-accent",
      buttonColor: "bg-accent hover:bg-accent/80 text-accent-foreground",
      onClick: () => setHelpCenterMapOpen(true),
      testId: "help-center-map-trigger"
    },
    {
      icon: Gamepad2,
      title: "Learning Games",
      description: "Master Aadhaar concepts through fun quizzes and earn badges while learning about DBT processes.",
      color: "bg-purple-100 text-purple-600",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
      onClick: () => setGamifiedLearningOpen(true),
      testId: "gamified-learning-trigger"
    },
    {
      icon: Calendar,
      title: "Scholarship Timeline",
      description: "Track important dates for applications, verification, and disbursement with personalized reminders.",
      color: "bg-pink-100 text-pink-600",
      buttonColor: "bg-pink-600 hover:bg-pink-700 text-white",
      onClick: () => setCountdownTrackerOpen(true),
      testId: "countdown-tracker-trigger"
    },
    {
      icon: FileText,
      title: "Educator Resources",
      description: "Download posters, guides, and presentation materials for PTA meetings and awareness campaigns.",
      color: "bg-green-100 text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700 text-white",
      onClick: () => setParentToolkitOpen(true),
      testId: "parent-toolkit-trigger"
    }
  ];

  const successStories = [
    {
      name: "Priya Sharma",
      location: "Bihar, Class 12",
      testimonial: "The DBT simulator helped me understand exactly what to expect. I successfully seeded my account and received my Post-Matric scholarship within 2 weeks!",
      amount: "₹45,000 received",
      initial: "P"
    },
    {
      name: "Rahul Kumar",
      location: "Jharkhand, Class 10",
      testimonial: "My family didn't know about Pre-Matric scholarships. The eligibility wizard showed me 3 scholarships I qualified for. Amazing!",
      amount: "₹12,000 received",
      initial: "R"
    },
    {
      name: "Anjali Devi",
      location: "West Bengal, Graduate",
      testimonial: "The WhatsApp reminders ensured I never missed any deadlines. I'm now pursuing my engineering degree thanks to these scholarships.",
      amount: "₹85,000 received",
      initial: "A"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-16 overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Unlock Your <span className="text-accent">Scholarship</span> Dreams
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Complete guide to Aadhaar seeding and scholarship access for Pre-Matric & Post-Matric students
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => setEligibilityWizardOpen(true)}
                className="bg-accent hover:bg-accent/80 text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg shadow-lg"
                data-testid="hero-check-eligibility"
              >
                <UserCheck className="mr-2" size={20} />
                {t('checkEligibility')}
              </Button>
              <Button 
                onClick={() => setDBTSimulatorOpen(true)}
                variant="outline"
                className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg bg-transparent"
                data-testid="hero-dbt-simulator"
              >
                <Dock className="mr-2" size={20} />
                {t('dbtSimulator')}
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-4 glass-effect">
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Your Scholarship Journey Starts Here</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Navigate through our comprehensive tools designed to make scholarship access simple and transparent
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border border-border">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${service.color}`}>
                    <service.icon size={32} />
                  </div>
                  <CardTitle className="text-xl font-semibold mb-3">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <Button 
                    onClick={service.onClick}
                    className={`w-full ${service.buttonColor} font-medium transition-colors`}
                    data-testid={service.testId}
                  >
                    {service.title.includes('Wizard') ? 'Start Wizard' :
                     service.title.includes('Simulator') ? 'Try Simulator' :
                     service.title.includes('Centers') ? 'Find Centers' :
                     service.title.includes('Games') ? 'Play & Learn' :
                     service.title.includes('Timeline') ? 'View Timeline' :
                     'Get Resources'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Awareness Section */}
      <VideoSection language={language} />

      {/* WhatsApp Integration */}
      <WhatsAppIntegration language={language} />

      {/* Success Stories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Success Stories</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real students sharing how Scholarship Hero helped them unlock their educational funding
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {story.initial}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{story.name}</h4>
                      <p className="text-sm text-muted-foreground">{story.location}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{story.testimonial}</p>
                  <div className="flex items-center text-sm text-accent">
                    <span className="mr-1">₹</span>
                    <span>{story.amount}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer language={language} />

      {/* Floating Chat Bot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setChatAssistantOpen(true)}
          className="bg-accent hover:bg-accent/80 text-accent-foreground w-16 h-16 rounded-full shadow-lg animate-bounce-slow"
          data-testid="floating-chat-bot"
        >
          <MessageSquare size={24} />
        </Button>
      </div>

      {/* Modals */}
      <EligibilityWizard 
        isOpen={eligibilityWizardOpen} 
        onClose={() => setEligibilityWizardOpen(false)}
        language={language}
      />
      <DBTSimulator 
        isOpen={dbtSimulatorOpen} 
        onClose={() => setDBTSimulatorOpen(false)}
        language={language}
      />
      <HelpCenterMap 
        isOpen={helpCenterMapOpen} 
        onClose={() => setHelpCenterMapOpen(false)}
        language={language}
      />
      <GamifiedLearning 
        isOpen={gamifiedLearningOpen} 
        onClose={() => setGamifiedLearningOpen(false)}
        language={language}
      />
      <CountdownTracker 
        isOpen={countdownTrackerOpen} 
        onClose={() => setCountdownTrackerOpen(false)}
        language={language}
      />
      <ParentToolkit 
        isOpen={parentToolkitOpen} 
        onClose={() => setParentToolkitOpen(false)}
        language={language}
      />
      <AIchatAssistant 
        isOpen={chatAssistantOpen} 
        onClose={() => setChatAssistantOpen(false)}
        language={language}
      />
    </div>
  );
}

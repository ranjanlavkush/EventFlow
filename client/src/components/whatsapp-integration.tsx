import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Language, useTranslation } from "@/lib/i18n";

interface WhatsAppIntegrationProps {
  language: Language;
}

export default function WhatsAppIntegration({ language }: WhatsAppIntegrationProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferences, setPreferences] = useState({
    deadlines: true,
    statusUpdates: true,
    newScholarships: true,
    generalUpdates: false
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const t = useTranslation(language);
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; preferences: Record<string, boolean> }) => {
      const response = await apiRequest('POST', '/api/subscribe-whatsapp', data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubscribed(true);
      toast({
        title: "WhatsApp Subscription Successful!",
        description: "You'll receive scholarship updates on WhatsApp",
      });
    },
    onError: () => {
      toast({
        title: "Subscription Failed",
        description: "Please check your phone number and try again",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    subscriptionMutation.mutate({
      phoneNumber: `+91${cleanNumber}`,
      preferences
    });
  };

  const handlePreferenceChange = (key: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-secondary text-secondary-foreground" data-testid="whatsapp-success">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Check className="mx-auto mb-4 text-6xl" />
            <h3 className="text-3xl font-bold mb-4">Successfully Subscribed!</h3>
            <p className="text-xl opacity-90 mb-8">
              You'll receive scholarship updates on WhatsApp at {phoneNumber}
            </p>
            
            <Card className="bg-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">You'll receive notifications for:</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  {preferences.deadlines && (
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>Application Deadlines</span>
                    </div>
                  )}
                  {preferences.statusUpdates && (
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>Status Updates</span>
                    </div>
                  )}
                  {preferences.newScholarships && (
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>New Scholarships</span>
                    </div>
                  )}
                  {preferences.generalUpdates && (
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>General Updates</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary text-secondary-foreground" data-testid="whatsapp-integration">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <MessageSquare className="mx-auto mb-4 text-6xl" />
            <h3 className="text-3xl font-bold mb-4">Stay Updated via WhatsApp</h3>
            <p className="text-xl opacity-90 mb-8">
              Get instant notifications about scholarship deadlines, DBT status updates, and new opportunities
            </p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <div className="flex-1">
                    <Input 
                      type="tel" 
                      placeholder="Enter your WhatsApp number" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-white text-gray-900 placeholder-gray-500"
                      data-testid="whatsapp-phone-input"
                      maxLength={10}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={subscriptionMutation.isPending}
                    className="bg-accent hover:bg-accent/80 text-accent-foreground whitespace-nowrap"
                    data-testid="whatsapp-subscribe-button"
                  >
                    <MessageSquare className="mr-2" size={16} />
                    {subscriptionMutation.isPending ? "Subscribing..." : t('subscribeNow')}
                  </Button>
                </div>

                {/* Notification Preferences */}
                <div className="max-w-md mx-auto">
                  <h4 className="font-semibold mb-4 text-left">Choose your notifications:</h4>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="deadlines"
                        checked={preferences.deadlines}
                        onCheckedChange={(checked) => handlePreferenceChange('deadlines', checked as boolean)}
                        data-testid="pref-deadlines"
                      />
                      <label htmlFor="deadlines" className="text-sm font-medium">
                        Application Reminders & Deadlines
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="status"
                        checked={preferences.statusUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange('statusUpdates', checked as boolean)}
                        data-testid="pref-status"
                      />
                      <label htmlFor="status" className="text-sm font-medium">
                        DBT Status & Transfer Updates
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="new"
                        checked={preferences.newScholarships}
                        onCheckedChange={(checked) => handlePreferenceChange('newScholarships', checked as boolean)}
                        data-testid="pref-new"
                      />
                      <label htmlFor="new" className="text-sm font-medium">
                        New Scholarship Announcements
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="general"
                        checked={preferences.generalUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange('generalUpdates', checked as boolean)}
                        data-testid="pref-general"
                      />
                      <label htmlFor="general" className="text-sm font-medium">
                        General Updates & Tips
                      </label>
                    </div>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm opacity-80">
                <div className="flex items-center">
                  <Check className="mr-2" size={16} />
                  Free Service
                </div>
                <div className="flex items-center">
                  <Check className="mr-2" size={16} />
                  No Spam
                </div>
                <div className="flex items-center">
                  <Check className="mr-2" size={16} />
                  Unsubscribe Anytime
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

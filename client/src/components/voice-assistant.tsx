import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Language, useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

interface VoiceAssistantProps {
  isActive: boolean;
  language: Language;
}

export default function VoiceAssistant({ isActive, language }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const t = useTranslation(language);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        if (recognitionRef.current) {
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = getLanguageCode(language);
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            handleVoiceCommand(transcript);
          };
          
          recognitionRef.current.onend = () => {
            setIsListening(false);
          };
          
          recognitionRef.current.onerror = () => {
            setIsListening(false);
            toast({
              title: "Voice Error",
              description: "Sorry, I couldn't understand. Please try again.",
              variant: "destructive"
            });
          };
        }
      }
    }
  }, [language, toast]);

  const getLanguageCode = (lang: Language): string => {
    const codes = {
      en: 'en-US',
      hi: 'hi-IN',
      mai: 'hi-IN', // Fallback to Hindi
      bho: 'hi-IN'  // Fallback to Hindi
    };
    return codes[lang] || 'en-US';
  };

  const speak = (text: string) => {
    if (synthRef.current && isActive) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && isActive) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Simple voice commands
    if (lowerCommand.includes('eligibility') || lowerCommand.includes('पात्रता')) {
      speak(language === 'en' ? 
        "Opening eligibility wizard. Please fill in your details to check eligible scholarships." :
        "पात्रता विज़ार्ड खोल रहे हैं। कृपया अपनी जानकारी भरें।"
      );
      // Trigger eligibility modal
      const element = document.querySelector('[data-testid="eligibility-wizard-trigger"]') as HTMLElement;
      element?.click();
    } else if (lowerCommand.includes('help') || lowerCommand.includes('सहायता')) {
      speak(language === 'en' ? 
        "How can I help you today? You can ask about scholarships, Aadhaar seeding, or DBT verification." :
        "आज मैं आपकी कैसे मदद कर सकता हूं? आप छात्रवृत्ति, आधार सीडिंग या डीबीटी सत्यापन के बारे में पूछ सकते हैं।"
      );
    } else {
      speak(language === 'en' ? 
        "I understand you said: " + command + ". Please use the navigation menu for specific actions." :
        "मैं समझ गया कि आपने कहा: " + command + "। कृपया विशिष्ट कार्यों के लिए नेवीगेशन मेनू का उपयोग करें।"
      );
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed top-20 right-4 z-40 bg-card border border-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-2">
        <Button
          variant={isListening ? "destructive" : "default"}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
          className={isListening ? "voice-recording" : ""}
          data-testid="voice-listen-button"
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
        
        {isSpeaking && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Volume2 size={16} className="mr-1 voice-recording" />
            Speaking...
          </div>
        )}
        
        {isListening && (
          <div className="text-sm text-muted-foreground">
            Listening...
          </div>
        )}
      </div>
    </div>
  );
}

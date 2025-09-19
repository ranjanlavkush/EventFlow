import { useState } from "react";
import { GraduationCap, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "./language-toggle";
import VoiceAssistant from "./voice-assistant";
import { useTranslation, type Language } from "@/lib/i18n";

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const t = useTranslation(language);

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  return (
    <>
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="text-2xl text-accent" size={32} />
              <h1 className="text-xl font-bold" data-testid="header-title">
                {t('title')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle 
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
              />
              
              <Button
                variant="secondary"
                onClick={handleVoiceToggle}
                className="bg-accent hover:bg-accent/80 text-accent-foreground"
                data-testid="voice-assistant-toggle"
              >
                {isVoiceActive ? <Volume2 className="mr-2" size={16} /> : <Mic className="mr-2" size={16} />}
                <span className="hidden sm:inline">{t('voiceHelp')}</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <VoiceAssistant isActive={isVoiceActive} language={language} />
    </>
  );
}

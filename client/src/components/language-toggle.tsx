import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Language } from "@/lib/i18n";

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  const languages = [
    { code: 'en' as Language, name: 'English', native: 'English' },
    { code: 'hi' as Language, name: 'Hindi', native: 'हिंदी' },
    { code: 'mai' as Language, name: 'Maithili', native: 'मैथिली' },
    { code: 'bho' as Language, name: 'Bhojpuri', native: 'भोजपुरी' }
  ];

  return (
    <Select value={currentLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger 
        className="w-32 bg-primary-foreground text-primary border-border"
        data-testid="language-select"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            data-testid={`language-option-${lang.code}`}
          >
            {lang.native}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const translations = {
  en: {
    title: "Scholarship Hero",
    subtitle: "Aadhaar Seeding & Scholarship Access Portal",
    heroTitle: "Unlock Your Scholarship Dreams",
    heroSubtitle: "Complete guide to Aadhaar seeding and scholarship access for Pre-Matric & Post-Matric students",
    checkEligibility: "Check My Eligibility",
    dbtSimulator: "DBT Status Simulator",
    voiceHelp: "Voice Help",
    findCenters: "Find Centers",
    playLearn: "Play & Learn",
    getResources: "Get Resources",
    subscribeNow: "Subscribe Now",
    nextStep: "Next Step",
    previousStep: "Previous Step",
    submit: "Submit",
    close: "Close"
  },
  hi: {
    title: "स्कॉलरशिप हीरो",
    subtitle: "आधार सीडिंग और छात्रवृत्ति पहुंच पोर्टल",
    heroTitle: "अपने छात्रवृत्ति सपनों को साकार करें",
    heroSubtitle: "प्री-मैट्रिक और पोस्ट-मैट्रिक छात्रों के लिए आधार सीडिंग और छात्रवृत्ति पहुंच की पूर्ण गाइड",
    checkEligibility: "मेरी पात्रता जांचें",
    dbtSimulator: "डीबीटी स्थिति सिम्युलेटर",
    voiceHelp: "आवाज सहायता",
    findCenters: "केंद्र खोजें",
    playLearn: "खेलें और सीखें",
    getResources: "संसाधन प्राप्त करें",
    subscribeNow: "अभी सब्सक्राइब करें",
    nextStep: "अगला कदम",
    previousStep: "पिछला कदम",
    submit: "जमा करें",
    close: "बंद करें"
  },
  mai: {
    title: "स्कॉलरशिप हीरो",
    subtitle: "आधार सीडिंग आ छात्रवृत्ति पहुंच पोर्टल",
    heroTitle: "अपन छात्रवृत्ति सपना केँ साकार करू",
    heroSubtitle: "प्री-मैट्रिक आ पोस्ट-मैट्रिक छात्र सबहक लेल आधार सीडिंग आ छात्रवृत्ति पहुंचक पूर्ण गाइड",
    checkEligibility: "हमर पात्रता जाँच करू",
    dbtSimulator: "डीबीटी स्थिति सिम्युलेटर",
    voiceHelp: "आवाज सहायता",
    findCenters: "केंद्र खोजू",
    playLearn: "खेलू आ सीखू",
    getResources: "संसाधन प्राप्त करू",
    subscribeNow: "आब सब्सक्राइब करू",
    nextStep: "अगिला कदम",
    previousStep: "पछिला कदम",
    submit: "जमा करू",
    close: "बन्न करू"
  },
  bho: {
    title: "स्कॉलरशिप हीरो",
    subtitle: "आधार सीडिंग अउर छात्रवृत्ति पहुंच पोर्टल",
    heroTitle: "अपना छात्रवृत्ति सपना के साकार करीं",
    heroSubtitle: "प्री-मैट्रिक अउर पोस्ट-मैट्रिक छात्रन खातिर आधार सीडिंग अउर छात्रवृत्ति पहुंच के पूरा गाइड",
    checkEligibility: "हमार पात्रता चेक करीं",
    dbtSimulator: "डीबीटी स्थिति सिम्युलेटर",
    voiceHelp: "आवाज सहायता",
    findCenters: "केंद्र खोजीं",
    playLearn: "खेलीं अउर सीखीं",
    getResources: "संसाधन लीं",
    subscribeNow: "अभी सब्सक्राइब करीं",
    nextStep: "अगला कदम",
    previousStep: "पिछला कदम",
    submit: "जमा करीं",
    close: "बंद करीं"
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export const useTranslation = (language: Language) => {
  return (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key];
  };
};

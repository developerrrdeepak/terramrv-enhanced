import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Languages, Globe, CheckCircle } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

const supportedLanguages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    region: "Global",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    flag: "🇮🇳",
    region: "North India",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    flag: "🇧🇩",
    region: "West Bengal, Bangladesh",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    flag: "🇮🇳",
    region: "Andhra Pradesh, Telangana",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    flag: "🇮🇳",
    region: "Maharashtra",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    flag: "🇮🇳",
    region: "Tamil Nadu",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    flag: "🇮🇳",
    region: "Gujarat",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    flag: "🇮🇳",
    region: "Karnataka",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    flag: "🇮🇳",
    region: "Punjab",
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    flag: "🇮🇳",
    region: "Odisha",
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    flag: "🇮🇳",
    region: "Assam",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    flag: "🇮🇳",
    region: "Kerala",
  },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  showModal?: boolean;
  onModalChange?: (show: boolean) => void;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  showModal = false,
  onModalChange,
}: LanguageSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(showModal);

  const currentLanguage =
    supportedLanguages.find((lang) => lang.code === selectedLanguage) ||
    supportedLanguages[0];

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsModalOpen(false);
    if (onModalChange) onModalChange(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
    if (onModalChange) onModalChange(true);
  };

  return (
    <>
      {/* Language Selector Button */}
      <Button
        variant="outline"
        onClick={openModal}
        className="flex items-center space-x-2 border-green-200 hover:bg-green-50"
      >
        <Globe className="h-4 w-4" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <Languages className="h-4 w-4" />
      </Button>

      {/* Language Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-600" />
              <span>Choose Your Language / अपनी भाषा चुनें</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Select your preferred language for the best farming experience
              </p>
              <p className="text-gray-600 text-sm">
                कृषि की बेहतर जानकारी के लिए अपनी भाषा चुनें
              </p>
            </div>

            {/* Current Selection */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currentLanguage.flag}</span>
                    <div>
                      <p className="font-semibold text-green-800">
                        {currentLanguage.nativeName}
                      </p>
                      <p className="text-sm text-green-600">
                        {currentLanguage.region}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Current
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Language Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {supportedLanguages.map((language) => (
                <Button
                  key={language.code}
                  variant={
                    selectedLanguage === language.code ? "default" : "outline"
                  }
                  className={`h-auto p-4 justify-start ${
                    selectedLanguage === language.code
                      ? "bg-green-600 hover:bg-green-700 border-green-600"
                      : "hover:bg-green-50 hover:border-green-200"
                  }`}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <span className="text-xl">{language.flag}</span>
                    <div className="text-left flex-1">
                      <p className="font-medium">{language.nativeName}</p>
                      <p
                        className={`text-xs ${
                          selectedLanguage === language.code
                            ? "text-green-100"
                            : "text-gray-600"
                        }`}
                      >
                        {language.region}
                      </p>
                    </div>
                    {selectedLanguage === language.code && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {/* Features Notice */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                🚀 Available in Your Language:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Complete website interface</li>
                <li>• AI chatbot conversations</li>
                <li>• Voice commands and responses</li>
                <li>• Farmer dashboard and forms</li>
                <li>• Educational content and guides</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Language settings are saved automatically. You can change this
                anytime.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook for language context
export const useLanguage = () => {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("preferred-language", newLanguage);
  };

  // Load saved language on mount
  useState(() => {
    const saved = localStorage.getItem("preferred-language");
    if (saved && supportedLanguages.find((l) => l.code === saved)) {
      setLanguage(saved);
    }
  });

  return { language, changeLanguage };
};

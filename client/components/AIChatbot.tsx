import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Bot,
  User,
  Languages,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  language: string;
}

interface AIChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLanguage: string;
}

const languages = {
  en: { name: "English", flag: "🇺🇸" },
  hi: { name: "हिंदी", flag: "🇮🇳" },
  bn: { name: "বাংলা", flag: "🇧🇩" },
  te: { name: "తెలుగు", flag: "🇮🇳" },
  mr: { name: "मराठी", flag: "🇮🇳" },
  ta: { name: "தமிழ்", flag: "🇮🇳" },
  gu: { name: "ગુજરાતી", flag: "🇮🇳" },
  kn: { name: "ಕನ್ನಡ", flag: "🇮🇳" },
  pa: { name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
};

// Mock AI responses for different languages
const mockResponses = {
  en: {
    greeting:
      "Hello! I'm Kisan AI, your farming assistant. How can I help you today?",
    carbonCredits:
      "Carbon credits are certificates that represent the reduction of one metric ton of CO2. Farmers can earn them through sustainable practices like agroforestry, improved soil management, and methane reduction in rice farming.",
    mrvProcess:
      "MRV stands for Monitoring, Reporting, and Verification. It's a process to track and verify your carbon reduction activities. Our system uses satellite data, IoT sensors, and field verification to ensure accurate measurements.",
    helpOptions:
      "I can help you with: 🌱 Carbon credit information, 📊 MRV process, 💰 Income calculation, 🌾 Farming best practices, 📱 App usage, and much more!",
  },
  hi: {
    greeting:
      "नमस्ते! मैं किसान AI हूं, आपका कृषि सहायक। आज मैं आपकी कैसे मदद कर सकता हूं?",
    carbonCredits:
      "कार्बन क्रेडिट प्रमाणपत्र हैं जो एक मीट्रिक टन CO2 की कमी को दर्शाते हैं। किसान वानिकी, बेहतर मिट्टी प्रबंधन, और धान की खेती में मीथेन कमी जैसे टिकाऊ तरीकों से इन्हें कमा सकते हैं।",
    mrvProcess:
      "MRV का मतलब है निगरानी, रिपोर्टिंग और सत्यापन। यह आपकी कार्बन कमी गतिविधियों को ट्रैक और सत्यापित करने की प्रक्रिया है।",
    helpOptions:
      "मैं इनमें ���पकी मदद कर सकता हूं: 🌱 कार्बन क्रेडिट जानकारी, 📊 MRV प्रक्रिया, 💰 आय गणना, 🌾 खेती की बेहतर प्रथाएं!",
  },
};

export default function AIChatbot({
  open,
  onOpenChange,
  selectedLanguage,
}: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(selectedLanguage);

  const recognition = useRef<any>(null);
  const synthesis = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Speech Recognition
      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        const SpeechRecognition =
          (window as any).webkitSpeechRecognition ||
          (window as any).SpeechRecognition;
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = getLanguageCode(chatLanguage);

        recognition.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognition.current.onerror = () => {
          setIsListening(false);
          toast.error("Voice recognition failed. Please try again.");
        };
      }

      // Speech Synthesis
      if ("speechSynthesis" in window) {
        synthesis.current = window.speechSynthesis;
      }
    }
  }, [chatLanguage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message when chat opens
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text:
          mockResponses[chatLanguage as keyof typeof mockResponses]?.greeting ||
          mockResponses.en.greeting,
        sender: "bot",
        timestamp: new Date(),
        language: chatLanguage,
      };
      setMessages([welcomeMessage]);
    }
  }, [open, chatLanguage]);

  const getLanguageCode = (lang: string) => {
    const codes: { [key: string]: string } = {
      en: "en-US",
      hi: "hi-IN",
      bn: "bn-IN",
      te: "te-IN",
      mr: "mr-IN",
      ta: "ta-IN",
      gu: "gu-IN",
      kn: "kn-IN",
      pa: "pa-IN",
    };
    return codes[lang] || "en-US";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      language: chatLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage, chatLanguage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        language: chatLanguage,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Speak the response if enabled
      if (synthesis.current && !isSpeaking) {
        speakMessage(botResponse, chatLanguage);
      }
    }, 1000);
  };

  const generateBotResponse = (userInput: string, language: string) => {
    const input = userInput.toLowerCase();
    const responses =
      mockResponses[language as keyof typeof mockResponses] || mockResponses.en;

    if (input.includes("carbon") || input.includes("कार्बन")) {
      return responses.carbonCredits;
    } else if (input.includes("mrv") || input.includes("निगरानी")) {
      return responses.mrvProcess;
    } else if (input.includes("help") || input.includes("मदद")) {
      return responses.helpOptions;
    } else if (
      input.includes("price") ||
      input.includes("income") ||
      input.includes("कमाई") ||
      input.includes("आय")
    ) {
      return language === "hi"
        ? "कार्बन क्रेडिट की कीमत ₹400-600 प्रति टन है। एक हेक्टेयर से आप सालाना 2-5 टन कार्बन क्रेडिट कमा सकते हैं, जिससे ₹800-3000 की अतिरिक्त आय हो सकती है।"
        : "Carbon credit prices range from ₹400-600 per ton. You can earn 2-5 tons of carbon credits per hectare annually, generating ₹800-3000 additional income.";
    } else if (
      input.includes("register") ||
      input.includes("signup") ||
      input.includes("पंजीकरण")
    ) {
      return language === "hi"
        ? "पंजीकरण के लिए: 1) 'Sign in (Farmer)' बटन पर क्लिक करें, 2) अपना ईमेल दर्ज करें, 3) OTP सत्यापित करें, 4) अपनी प्रोफाइल पूरी करें।"
        : "To register: 1) Click 'Sign in (Farmer)' button, 2) Enter your email, 3) Verify OTP, 4) Complete your profile.";
    } else {
      return language === "hi"
        ? "मैं समझ नहीं पाया। कृपया कार्बन क्रेडिट, MRV प्रक्रिया, या कमाई के बारे में पूछें। मैं आपकी मदद करने के लिए यहाँ हूँ!"
        : "I didn't understand. Please ask about carbon credits, MRV process, or earnings. I'm here to help you!";
    }
  };

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.lang = getLanguageCode(chatLanguage);
      recognition.current.start();
    } else {
      toast.error("Voice recognition not supported in your browser");
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string, language: string) => {
    if (synthesis.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.8;
      utterance.pitch = 1;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthesis.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis.current) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[80vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-full">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="flex items-center space-x-2">
                  <span>Kisan AI Assistant</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    🟢 Online
                  </Badge>
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  Multilingual farming support
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={chatLanguage} onValueChange={setChatLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languages).map(([code, lang]) => (
                    <SelectItem key={code} value={code}>
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {!isMinimized && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-green-600 text-white ml-4"
                          : "bg-gray-100 text-gray-900 mr-4"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "bot" && (
                          <Bot className="h-4 w-4 mt-1 text-green-600" />
                        )}
                        {message.sender === "user" && (
                          <User className="h-4 w-4 mt-1 text-white" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {message.sender === "bot" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              speakMessage(message.text, message.language)
                            }
                            className="h-6 w-6 p-0"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="p-4 border-t">
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage(
                      chatLanguage === "hi"
                        ? "कार्बन क्रेडिट क्या है?"
                        : "What are carbon credits?",
                    )
                  }
                >
                  {chatLanguage === "hi"
                    ? "🌱 कार्बन क्रेडिट"
                    : "🌱 Carbon Credits"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage(
                      chatLanguage === "hi"
                        ? "मैं कैसे रजिस्टर करूं?"
                        : "How do I register?",
                    )
                  }
                >
                  {chatLanguage === "hi" ? "📝 रजिस्टर करें" : "📝 Register"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage(
                      chatLanguage === "hi"
                        ? "मैं कितना कमा सकता हूं?"
                        : "How much can I earn?",
                    )
                  }
                >
                  {chatLanguage === "hi" ? "💰 कमाई" : "💰 Earnings"}
                </Button>
              </div>

              {/* Input Area */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      chatLanguage === "hi"
                        ? "अपना सवाल टाइप करें..."
                        : "Type your question..."
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute right-1 top-1 h-8 w-8 ${isListening ? "text-red-600" : "text-gray-600"}`}
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  className={isSpeaking ? "text-red-600" : "text-gray-600"}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

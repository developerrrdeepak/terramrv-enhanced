import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Phone,
  PhoneOff,
  Copy,
  RotateCcw,
  Settings,
  Sparkles,
  Zap,
  Heart,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  language: string;
  type?: "text" | "voice";
  isTyping?: boolean;
}

interface EnhancedAIChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLanguage: string;
}

const languages = {
  en: { name: "English", flag: "🇺🇸", voice: "en-US" },
  hi: { name: "हिंदी", flag: "🇮🇳", voice: "hi-IN" },
  bn: { name: "বাংলা", flag: "🇧🇩", voice: "bn-IN" },
  te: { name: "తెలుగు", flag: "🇮🇳", voice: "te-IN" },
  mr: { name: "मराठी", flag: "🇮🇳", voice: "mr-IN" },
  ta: { name: "தமிழ்", flag: "🇮🇳", voice: "ta-IN" },
  gu: { name: "ગુજરાતી", flag: "🇮🇳", voice: "gu-IN" },
  kn: { name: "ಕನ್ನಡ", flag: "🇮🇳", voice: "kn-IN" },
  pa: { name: "ਪੰਜਾਬੀ", flag: "🇮🇳", voice: "pa-IN" },
};

// Enhanced AI responses with more context and personality
const enhancedResponses = {
  en: {
    greeting:
      "👋 Hello! I'm **Kisan AI**, your intelligent farming companion! I'm here to help you with carbon credits, sustainable farming practices, and maximizing your agricultural income. How can I assist you today?",
    carbonCredits: `🌱 **Carbon Credits - Your Green Gold!**

Carbon credits are certificates that represent reducing 1 metric ton of CO2 from the atmosphere. Here's how farmers like you can benefit:

**💰 Earning Potential:**
- ₹400-600 per carbon credit
- 2-5 credits per hectare annually
- Additional income of ₹800-3,000 per hectare

**🌾 How to Earn:**
• **Agroforestry**: Plant trees alongside crops
• **Improved Soil Management**: Reduce tillage, cover crops
• **Rice Farming**: Alternate wetting/drying methods
• **Biomass Management**: Proper crop residue handling

Would you like me to calculate your potential earnings based on your farm size?`,

    mrvProcess: `📊 **MRV Process - Made Simple!**

MRV stands for **Monitoring, Reporting & Verification**. Think of it as your farm's carbon passport:

**🛰️ Monitoring**: We track your activities using:
- Satellite imagery
- Your smartphone data
- IoT sensors on your farm
- Regular field visits

**📱 Reporting**: You simply:
- Take photos of your activities
- Answer voice questions in your language
- Upload through our mobile app

**✅ Verification**: Our AI + experts verify:
- Your carbon reduction activities
- Calculate accurate credit amounts
- Ensure global standards compliance

The best part? Everything happens automatically in the background!`,

    registration: `📝 **Farmer Registration - Join the Carbon Revolution!**

Registration is simple and FREE! Here's what you need:

**📋 Required Information:**
• Email address or phone number
• Farm location (we'll help with GPS)
• Land size (approximate is fine)
• Current crops grown
• Basic farming practices

**🎁 Registration Benefits:**
• Free carbon potential assessment
• Real-time earning calculations
• Expert farming advice in your language
• Priority access to carbon projects
• Monthly income reports

**⚡ Quick Steps:**
1. Click 'Sign in (Farmer)' above
2. Verify with OTP
3. Complete your farm profile
4. Start earning from day 1!

Ready to transform your farming income?`,

    earnings: `💰 **Your Carbon Earning Potential**

Let me break down realistic income projections:

**🌾 Small Farm (1-2 hectares):**
- Carbon credits: 2-8 per year
- Additional income: ₹800-4,800 annually
- Monthly average: ₹65-400

**🌳 Medium Farm (3-5 hectares):**
- Carbon credits: 6-25 per year  
- Additional income: ₹2,400-15,000 annually
- Monthly average: ₹200-1,250

**🚜 Large Farm (5+ hectares):**
- Carbon credits: 10-50+ per year
- Additional income: ₹4,000-30,000+ annually
- Monthly average: ₹330-2,500+

**💡 Pro Tips to Maximize Earnings:**
• Combine multiple carbon activities
• Join our farmer groups for better rates
• Use our recommended sustainable practices
• Maintain consistent documentation

Want me to calculate specific earnings for your farm?`,

    helpOptions: `🤖 **I'm Your Complete Farming Assistant!**

Here's everything I can help you with:

**🌱 Carbon & Sustainability:**
• Carbon credit opportunities
• Sustainable farming practices
• Environmental certifications
• Climate-smart agriculture

**💰 Financial Planning:**
• Income calculations
• Cost-benefit analysis
• Government scheme information
• Market price predictions

**📱 Technology Support:**
• App usage guidance
• Voice command help
• Photo documentation tips
• Data syncing troubleshooting

**🌾 Farming Expertise:**
• Crop advisory
• Weather forecasts
• Pest management
• Soil health tips

**🎯 Voice Commands You Can Try:**
"Calculate my earnings"
"Show carbon projects"
"What crops should I plant?"
"How do I register?"

Just speak naturally - I understand context and remember our conversation!`,

    voiceHelp: `🎤 **Voice Assistant - Speak Naturally!**

I'm designed to understand your natural speech in multiple languages:

**🗣️ Voice Features:**
• Continuous conversation mode
• Interrupt and ask follow-ups
• Voice-to-voice responses
• Background noise filtering

**📞 Phone Call Mode:**
• Just like talking to a friend
• Hands-free farming consultation
• Works while you're in the field
• Auto-saves important information

**🌐 Language Support:**
• Hindi, English, and 7+ regional languages
• Mixed language conversations (Hinglish)
• Automatic language detection
• Context-aware responses

**💡 Try These Voice Commands:**
"Hey Kisan, मेरी फसल का हाल बताओ"
"Calculate carbon credits for wheat farming"
"কার্বন ক্রেডিট কি?" (in Bengali)
"મને ગુજરાતીમાં સમજાવો" (in Gujarati)

Ready to chat? Just click the microphone! 🎤`,
  },
  hi: {
    greeting:
      "🙏 नमस्ते! मैं **किसान AI** हूं, आपका बुद्धिमान खेती साथी! मैं कार्बन क्रेडिट, टिकाऊ खेती और आपकी कृषि आय बढ़ाने में मदद करता हूं। आज मैं आपकी कैसे सेवा कर सकता हूं?",
    carbonCredits: `🌱 **कार्बन क्रेडिट - आपका हरा सोना!**

कार्बन क्रेडिट ऐसे प्रमाणपत्र हैं जो 1 मीट्रिक टन CO2 कम करने का प्रतिनिधित्व करते हैं। जानिए कैसे फायदा उठाएं:

**💰 कमाई की संभावना:**
- ₹400-600 प्रति कार्बन क्रेडिट
- 2-5 क्रेडिट प्रति हेक्टेयर सालाना
- ₹800-3,000 प्रति हेक्टेयर अतिरिक्त आय

**🌾 कैसे कमाएं:**
• **वानिकी**: फसलों के साथ पेड़ लगाएं
• **मिट्टी प्रबंधन**: कम जुताई, आवरण फसलें
• **धान की खेती**: सीधी बुवाई विधि
• **फसल अवशेष**: उचित प��रबंधन

क्या आप चाहते हैं कि मैं आपके खेत के आधार पर संभावित कमाई की गणना करूं?`,

    mrvProcess: `📊 **MRV प्रक्रिया - आसान भाषा में!**

MRV यानी **निगरानी, रिपोर्टिंग और सत्यापन**। इसे अपने खेत का कार्बन पासपोर्ट समझें:

**🛰️ निगरानी**: हम ट्रैक करते हैं:
- उपग्रह चित्र
- आपके स्मार्टफोन का डेटा  
- खेत में IoT सेंसर
- नियमित क्षेत्रीय दौरे

**📱 रिपोर्टिंग**: आप बस:
- अपनी गतिविधियों की फोटो लें
- अपनी भाषा में आवाज़ी सवालों के जवाब दें
- मोबाइल ऐप से अपलोड करें

**✅ सत्यापन**: हमारी AI + विशेषज्ञ:
- आपकी कार्बन कमी गतिविधियों की जांच
- सटीक क्रेडिट राशि की गणना
- वैश्विक मानकों का अनुपालन सुनिश्चित करना

सबसे अच्छी बात? सब कुछ अपने आप पीछे होता रहता है!`,

    registration: `📝 **किसान पंजीकरण - कार्बन क्रांति में शामिल हों!**

पंजीकरण आसान और बिल्कुल मुफ्त है! आपको च��हिए:

**📋 आवश्यक जानकारी:**
• ईमेल पता या फोन नंबर
• खेत का स्थान (हम GPS से मदद करेंगे)
• जमीन का आकार (अनुमानित ठीक है)
• वर्तमान फसलें
• बुनियादी खेती के तरीके

**🎁 पंजीकरण के फायदे:**
• मुफ्त कार्बन क्षमता का आकलन
• रियल-टाइम कमाई की गणना
• आपकी भाषा में विशेषज्ञ सलाह
• कार्बन परियोजनाओं तक प्राथमिकता पहुंच
• मासिक आय रिपोर्ट

**⚡ आसान कदम:**
1. ऊपर 'साइन इन (किसान)' पर क्लिक करें
2. OTP से सत्यापित करें
3. अपनी खेती प्रोफ़ाइल पूरी करें
4. पहले दिन से कमाना शुरू करें!

अपनी खेती की आय बदलने के लिए तैयार हैं?`,

    earnings: `💰 **आपकी कार्बन क���ाई की संभावना**

आइए वास्तविक आय का अनुमान देखते हैं:

**🌾 छोटा खेत (1-2 हेक्टेयर):**
- कार्बन क्र��डिट: 2-8 प्रति वर्ष
- अतिरिक्त आय: ₹800-4,800 वार्षिक

**🚜 मध्यम खेत (3-5 हेक्टेयर):**
- कार्बन क्रेडिट: 6-25 प्रति वर्ष
- अतिरिक्त आय: ₹2,400-15,000 वार्षिक

**🌾 बड़ा खेत (5+ हेक्टेयर):**
- कार्बन क्रेडिट: 10-50+ प्रति वर्ष
- अतिरिक्त आय: ₹4,000-30,000+ वार्षिक

यह राशि आपकी नियमित खेती आय के अतिरिक्त है! मुझे अपने खेत का आकार बताएं और मैं सटीक गणना करूंगा।`,

    voiceHelp: `🎤 **आवाज़ी सहायता - अपनी भाषा में बात करें!**

बस माइक बटन दबाएं और प्राकृतिक रूप से बोलें:

**📞 कमांड उदाहरण:**
• "मेरी जमीन 2 हेक्टेयर है, कितना कमा सकता हूं?"
• "धान की खेती में कार्बन क्रेडिट कैसे मिल���गा?"
• "रजिस्ट्रेशन की पूरी प्रक्रिया बताओ"
• "कौन सी सरकारी योजना सबसे अच्छी है?"

**🌟 विशेषताएं:**
• आपकी आवाज़ को तुरंत पहचानता हूं
• हिंदी, अंग्रेजी और मिश्रित भाषा समझता हूं
• संदर्भ याद रखता हूं
• व्यक्तिगत सुझाव देता हूं

बात करने के लिए तैयार? बस माइक्रोफोन पर क्लिक करें! 🎤`,

    helpOptions: `🤖 **मैं आपका संपूर्ण खेती सहायक हूं!**

यहां सब कुछ है जिसमें मैं आपकी मदद कर सकता हूं:

**🌱 कार्बन और स्थिरता:**
• कार्बन क्रेडिट के अवसर
• टिकाऊ खेती के तरीके
• पर्यावरणीय प्रमाणन
• जलवायु-स्मार्ट कृषि

**💰 वित्तीय योजना:**
• आय की गण���ा
• लागत-लाभ विश्लेषण
• सरकारी योजना की जानकारी
• बाजार मूल्य की भविष्यवाणी

**📱 तकनीकी सहायता:**
• ऐ��� उपयोग मार्गदर्शन
• आवाज़ी कमांड सहायता
• फोटो दस्तावेज़ीकरण टिप्स
• डेटा सिंकिंग समस्या निवारण

**🎯 आवाज़ी कमांड आज़माएं:**
"मेरी कमाई बताओ"
"कार्बन प्रोजेक्ट दिखाओ"
"कौन सी फसल लगाऊं?"
"रजिस्ट्रेशन कैसे करूं?"

बस प्राकृतिक रूप से बोलें - मैं संदर्भ समझता हूं और हमारी बातचीत याद रखता हूं!`,
  },
};

export default function EnhancedAIChatbot({
  open,
  onOpenChange,
  selectedLanguage,
}: EnhancedAIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(selectedLanguage);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationMode, setConversationMode] = useState<
    "text" | "voice" | "phone"
  >("text");
  const [isOnline, setIsOnline] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const recognition = useRef<any>(null);
  const synthesis = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationContext = useRef<string[]>([]);

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
        recognition.current.lang =
          languages[chatLanguage as keyof typeof languages]?.voice || "en-US";

        recognition.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
          // Auto-send in voice mode
          if (conversationMode === "voice" || conversationMode === "phone") {
            setTimeout(() => handleSendMessage(transcript), 500);
          }
        };

        recognition.current.onerror = () => {
          setIsListening(false);
          if (conversationMode === "voice" || conversationMode === "phone") {
            // Restart listening in voice mode
            setTimeout(() => startListening(), 1000);
          }
        };
      }

      // Speech Synthesis
      if ("speechSynthesis" in window) {
        synthesis.current = window.speechSynthesis;
      }
    }
  }, [chatLanguage, conversationMode]);

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
          enhancedResponses[chatLanguage as keyof typeof enhancedResponses]
            ?.greeting || enhancedResponses.en.greeting,
        sender: "bot",
        timestamp: new Date(),
        language: chatLanguage,
      };
      setMessages([welcomeMessage]);
    }
  }, [open, chatLanguage]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
      language: chatLanguage,
      type: conversationMode === "text" ? "text" : "voice",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    conversationContext.current.push(text);

    // Show typing indicator
    setIsTyping(true);
    const typingMessage: Message = {
      id: "typing",
      text: "",
      sender: "bot",
      timestamp: new Date(),
      language: chatLanguage,
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    // Generate AI response with enhanced context awareness
    setTimeout(() => {
      const botResponse = generateEnhancedBotResponse(
        text,
        chatLanguage,
        conversationContext.current,
      );
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        language: chatLanguage,
      };

      setIsTyping(false);
      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing").concat(botMessage),
      );

      // Auto-speak in voice/phone mode
      if (
        (conversationMode === "voice" || conversationMode === "phone") &&
        autoSpeak
      ) {
        setTimeout(() => {
          speakMessage(botResponse, chatLanguage);
        }, 500);
      }

      // Continue listening in voice mode
      if (conversationMode === "voice" || conversationMode === "phone") {
        setTimeout(() => {
          startListening();
        }, 2000);
      }
    }, 1500); // Realistic typing delay
  };

  const generateEnhancedBotResponse = (
    userInput: string,
    language: string,
    context: string[],
  ) => {
    const input = userInput.toLowerCase();
    const responses =
      enhancedResponses[language as keyof typeof enhancedResponses] ||
      enhancedResponses.en;

    // Context-aware responses
    const hasDiscussedCredits = context.some(
      (msg) => msg.includes("carbon") || msg.includes("कार्बन"),
    );
    const hasDiscussedRegistration = context.some(
      (msg) => msg.includes("register") || msg.includes("पंजीकर��"),
    );

    // Enhanced pattern matching with context
    if (
      input.includes("carbon") ||
      input.includes("कार्बन") ||
      input.includes("credit")
    ) {
      return responses.carbonCredits;
    } else if (
      input.includes("mrv") ||
      input.includes("निगरानी") ||
      input.includes("monitoring")
    ) {
      return responses.mrvProcess;
    } else if (
      input.includes("register") ||
      input.includes("signup") ||
      input.includes("पंजीकरण") ||
      input.includes("join")
    ) {
      return responses.registration;
    } else if (
      input.includes("earn") ||
      input.includes("income") ||
      input.includes("कमाई") ||
      input.includes("आय") ||
      input.includes("money") ||
      input.includes("price")
    ) {
      return responses.earnings;
    } else if (
      input.includes("voice") ||
      input.includes("speak") ||
      input.includes("mic") ||
      input.includes("बोल") ||
      input.includes("आवाज़")
    ) {
      return responses.voiceHelp || responses.helpOptions;
    } else if (
      input.includes("help") ||
      input.includes("मदद") ||
      input.includes("सहायता") ||
      input.includes("what can you do")
    ) {
      return responses.helpOptions;
    } else if (
      input.includes("farm size") ||
      input.includes("hectare") ||
      input.includes("acre") ||
      input.includes("हेक्टेयर")
    ) {
      return language === "hi"
        ? `🌾 **खेत का आकार और कमाई:**\n\nमुझे बताएं आपका खेत कितना बड़ा है:\n• छोटा खेत (1-2 हेक्टेयर)\n• मध्यम खेत (3-5 हेक्टेयर)\n• बड़ा खेत (5+ हेक्टेयर)\n\nमैं आपके लिए सटीक कमाई की गणना कर दूंगा! 💰`
        : `🌾 **Farm Size & Earnings:**\n\nTell me your farm size:\n• Small farm (1-2 hectares)\n• Medium farm (3-5 hectares)\n• Large farm (5+ hectares)\n\nI'll calculate exact earnings for you! 💰`;
    } else if (
      input.includes("crops") ||
      input.includes("फसल") ||
      input.includes("plant") ||
      input.includes("grow")
    ) {
      return language === "hi"
        ? `🌾 **फसल सलाह:**\n\nकार्बन क्रेडिट के लिए सबसे अच्छी फस��ें:\n• **धान**: SRI विधि से 30% अधिक कमाई\n• **गेहूं**: ज़ीरो टिलेज से 2-3 क्रेडिट/हेक्टेयर\n• **दालें**: नाइट्रोजन फिक्सेशन से अतिरिक्त लाभ\n• **बागवानी**: लंबी अवधि में सबसे ज्यादा फायदा\n\nकौन सी फसल के बारे में विस्तार से जानना चाहते हैं?`
        : `🌾 **Crop Advisory:**\n\nBest crops for carbon credits:\n• **Rice**: SRI method gives 30% more earnings\n• **Wheat**: Zero tillage yields 2-3 credits/hectare\n• **Pulses**: Extra benefits from nitrogen fixation\n• **Horticulture**: Highest long-term profits\n\nWhich crop would you like to know more about?`;
    } else {
      // Contextual default responses
      if (hasDiscussedCredits && !hasDiscussedRegistration) {
        return language === "hi"
          ? `मुझे खुशी है कि आप कार्बन क्रेडिट में रुचि रखते हैं! 🌱\n\n**अगला कदम**: पंजीकरण करके आज ही शुरुआत करें। बस ��हें "रजिस्ट्रेशन कैसे करें" या ऊपर 'Sign in (Farmer)' बटन पर क्लिक करें।\n\n**या फिर पूछें:**\n• "मेरी कमाई कितनी होगी?"\n• "कौन सी फसल सबसे अच्छी है?"\n• "MRV क्या है?"\n\nमैं आपकी पूरी मदद करने के लिए यहाँ हूँ! 😊`
          : `Great to see your interest in carbon credits! 🌱\n\n**Next Step**: Register today to get started. Just say "how to register" or click 'Sign in (Farmer)' above.\n\n**Or ask me:**\n• "What will be my earnings?"\n• "Which crop is best?"\n• "What is MRV?"\n\nI'm here to help you succeed! 😊`;
      } else {
        return language === "hi"
          ? `मैं समझ नहीं पाया। 🤔 मैं इन विषयों में आपकी मदद कर सकता हूं:\n\n**🌱 मुख्य विषय:**\n• "कार्बन क्रेडिट क्या है?"\n• "रजिस्ट्रेशन कैसे करें?"\n• "मेरी कमाई कितनी होगी?"\n• "कौन सी फसल लगाऊं?"\n\n**🎤 आवाज़ी सहायता:** "voice help"\n\nबस प्राकृतिक रूप से बोलें या टाइप करें - मैं आपकी भाषा समझता हूं! 😊`
          : `I didn't quite understand that. 🤔 I can help you with:\n\n**🌱 Main Topics:**\n• "What are carbon credits?"\n• "How to register?"\n• "What will I earn?"\n• "Which crops to grow?"\n\n**🎤 Voice Help:** "voice help"\n\nJust speak or type naturally - I understand your language! 😊`;
      }
    }
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.lang =
        languages[chatLanguage as keyof typeof languages]?.voice || "en-US";
      recognition.current.start();
    } else if (!recognition.current) {
      toast.error(
        chatLanguage === "hi"
          ? "आपका ब्राउज़र वॉयस को सपोर्ट नही�� करता"
          : "Voice recognition not supported",
      );
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string, language: string) => {
    if (synthesis.current && text) {
      setIsSpeaking(true);
      // Remove markdown formatting for speech
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/[•*#]/g, "")
        .replace(/\n/g, " ");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang =
        languages[language as keyof typeof languages]?.voice || "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synthesis.current.cancel(); // Cancel any ongoing speech
      synthesis.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis.current) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleConversationMode = () => {
    const modes: Array<"text" | "voice" | "phone"> = ["text", "voice", "phone"];
    const currentIndex = modes.indexOf(conversationMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setConversationMode(nextMode);

    if (nextMode === "voice" || nextMode === "phone") {
      toast.success(
        chatLanguage === "hi"
          ? `🎤 ${nextMode === "phone" ? "फोन कॉल" : "वॉयस"} मोड चालू। बोलना शुरू करें!`
          : `🎤 ${nextMode === "phone" ? "Phone Call" : "Voice"} mode activated. Start speaking!`,
      );
      setTimeout(() => startListening(), 1000);
    } else {
      stopListening();
      stopSpeaking();
      toast.info(
        chatLanguage === "hi"
          ? "📝 टेक्स्ट मोड चालू"
          : "📝 Text mode activated",
      );
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(
      chatLanguage === "hi" ? "📋 कॉपी हो गया!" : "📋 Copied to clipboard!",
    );
  };

  const clearChat = () => {
    setMessages([]);
    conversationContext.current = [];
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text:
        enhancedResponses[chatLanguage as keyof typeof enhancedResponses]
          ?.greeting || enhancedResponses.en.greeting,
      sender: "bot",
      timestamp: new Date(),
      language: chatLanguage,
    };
    setMessages([welcomeMessage]);
    toast.success(
      chatLanguage === "hi" ? "🔄 चैट क्लियर हो गया" : "🔄 Chat cleared",
    );
  };

  const formatMessage = (text: string) => {
    // Convert markdown-style formatting to JSX
    return text.split("\n").map((line, index) => {
      // Bold text
      const boldFormatted = line.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>",
      );
      // Bullet points
      const bulletFormatted = boldFormatted
        .replace(/^• /, "• ")
        .replace(/^•/, "•");

      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: bulletFormatted }}
        />
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] p-0 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <DialogHeader className="p-6 pb-2 border-b bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12 bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-white shadow-lg">
                  <AvatarFallback className="text-white font-bold text-lg">
                    <Bot className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <DialogTitle className="flex items-center space-x-2 text-xl">
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                    Kisan AI Assistant
                  </span>
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                </DialogTitle>
                <div className="flex items-center space-x-2 text-sm">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-300"
                  >
                    🟢 Online
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      conversationMode === "text" &&
                        "bg-blue-100 text-blue-700",
                      conversationMode === "voice" &&
                        "bg-purple-100 text-purple-700",
                      conversationMode === "phone" && "bg-red-100 text-red-700",
                    )}
                  >
                    {conversationMode === "text" && "📝 Text"}
                    {conversationMode === "voice" && "🎤 Voice"}
                    {conversationMode === "phone" && "📞 Phone"}
                  </Badge>
                  {isListening && (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-700 animate-pulse"
                    >
                      🎤 Listening...
                    </Badge>
                  )}
                  {isSpeaking && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 animate-pulse"
                    >
                      🔊 Speaking...
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={chatLanguage} onValueChange={setChatLanguage}>
                <SelectTrigger className="w-36 bg-white/80">
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
                onClick={toggleConversationMode}
              >
                {conversationMode === "text" && (
                  <MessageCircle className="h-4 w-4" />
                )}
                {conversationMode === "voice" && <Mic className="h-4 w-4" />}
                {conversationMode === "phone" && <Phone className="h-4 w-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={clearChat}>
                <RotateCcw className="h-4 w-4" />
              </Button>

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
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] ${message.sender === "user" ? "ml-4" : "mr-4"}`}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-6 py-4 shadow-lg",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                            : "bg-white border border-gray-200 text-gray-900",
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          {message.sender === "bot" && (
                            <Avatar className="h-8 w-8 bg-gradient-to-r from-green-600 to-emerald-600 mt-1">
                              <AvatarFallback className="text-white">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className="flex-1 min-w-0">
                            {message.isTyping ? (
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                                <span className="text-gray-600 text-sm animate-pulse">
                                  {chatLanguage === "hi"
                                    ? "टाइप कर रहा है..."
                                    : "Typing..."}
                                </span>
                              </div>
                            ) : (
                              <>
                                <div
                                  className={cn(
                                    "text-base leading-relaxed",
                                    message.sender === "user"
                                      ? "text-white"
                                      : "text-gray-900",
                                  )}
                                >
                                  {message.sender === "bot" ? (
                                    <div className="space-y-2">
                                      {formatMessage(message.text)}
                                    </div>
                                  ) : (
                                    message.text
                                  )}
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                  <span
                                    className={cn(
                                      "text-xs",
                                      message.sender === "user"
                                        ? "text-green-100"
                                        : "text-gray-500",
                                    )}
                                  >
                                    {message.timestamp.toLocaleTimeString()}
                                    {message.type === "voice" && " 🎤"}
                                  </span>

                                  <div className="flex items-center space-x-2">
                                    {message.sender === "bot" && (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            copyMessage(message.text)
                                          }
                                          className="h-6 w-6 p-0 hover:bg-gray-100"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            speakMessage(
                                              message.text,
                                              message.language,
                                            )
                                          }
                                          className="h-6 w-6 p-0 hover:bg-gray-100"
                                        >
                                          <Volume2 className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {message.sender === "user" && (
                            <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 mt-1">
                              <AvatarFallback className="text-white">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="p-6 border-t bg-white/80 backdrop-blur">
              <div className="flex flex-wrap gap-2 mb-4">
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
                  className="bg-green-50 hover:bg-green-100 border-green-200"
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
                        ? "रजिस्ट्रेशन कैसे करूं?"
                        : "How do I register?",
                    )
                  }
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200"
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
                  className="bg-amber-50 hover:bg-amber-100 border-amber-200"
                >
                  {chatLanguage === "hi" ? "💰 कमाई" : "💰 Earnings"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("voice help")}
                  className="bg-purple-50 hover:bg-purple-100 border-purple-200"
                >
                  🎤 Voice Help
                </Button>
              </div>

              {/* Input Area */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      chatLanguage === "hi"
                        ? conversationMode === "voice"
                          ? "बोलें या टाइप करें..."
                          : "अपना सवाल टाइप करें..."
                        : conversationMode === "voice"
                          ? "Speak or type..."
                          : "Type your question..."
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-12 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                    disabled={conversationMode === "phone"}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "absolute right-2 top-1 h-8 w-8",
                      isListening
                        ? "text-red-600 animate-pulse"
                        : "text-gray-600",
                    )}
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
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  className={cn(
                    "shadow-lg",
                    isSpeaking
                      ? "text-red-600 border-red-300"
                      : "text-gray-600",
                  )}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {conversationMode !== "text" && (
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-600 flex items-center justify-center space-x-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span>
                      {chatLanguage === "hi"
                        ? conversationMode === "phone"
                          ? "📞 फोन कॉल मोड - हाथ-मुक्त बातचीत करें"
                          : "🎤 वॉयस मोड - बस बोलना शुरू करें"
                        : conversationMode === "phone"
                          ? "📞 Phone Call Mode - Hands-free conversation"
                          : "🎤 Voice Mode - Just start speaking"}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

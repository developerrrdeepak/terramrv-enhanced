import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Smartphone,
  Download,
  Star,
  Users,
  TrendingUp,
  Shield,
  Mic,
  Camera,
  MapPin,
  Wallet,
  Languages,
  Wifi,
  Play,
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  Award,
  MessageCircle,
  Calendar,
  IndianRupee,
  BarChart3,
  Leaf,
  TreePine,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CaseStudies() {
  const appFeatures = [
    {
      icon: Languages,
      title: "15+ Indian Languages",
      subtitle: "अपनी भाषा में खेती",
      description:
        "Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati और अन्य भाषाओं में पूरा एप्प",
      color: "bg-blue-500",
    },
    {
      icon: Mic,
      title: "Voice Commands",
      subtitle: "बोलकर काम करें",
      description: "Voice में डेटा इनपुट करें, AI से सवाल पूछें, रिपोर्ट सुनें",
      color: "bg-purple-500",
    },
    {
      icon: Camera,
      title: "Photo-Based Reporting",
      subtitle: "तस्वीर लेकर रिपोर्ट करें",
      description:
        "फसल की फोटो लेकर AI automatically carbon credits calculate करेगा",
      color: "bg-green-500",
    },
    {
      icon: Wifi,
      title: "Offline Mode",
      subtitle: "बिना इंटरनेट के काम करें",
      description:
        "7 दिन तक offline data collect करें, Internet आने पर sync ��ो जाएगा",
      color: "bg-orange-500",
    },
    {
      icon: Wallet,
      title: "UPI Direct Payment",
      subtitle: "सीधे पैसे मिलें",
      description:
        "Carbon credits का पैसा directly आपके bank account में UPI से",
      color: "bg-pink-500",
    },
    {
      icon: MessageCircle,
      title: "24/7 AI Support",
      subtitle: "हमेशा मदद मिले",
      description: "Kisan AI से किसी भी समय खेती के बारे में पूछें",
      color: "bg-cyan-500",
    },
  ];

  const appStats = [
    { number: "50,000+", label: "Active Farmers", icon: Users },
    { number: "4.8/5", label: "App Rating", icon: Star },
    { number: "₹25,000", label: "Avg Monthly Earning", icon: IndianRupee },
    { number: "95%", label: "Success Rate", icon: CheckCircle },
  ];

  const farmerTestimonials = [
    {
      name: "रामेश्वर पाटील",
      location: "महाराष्ट्र",
      crop: "Cotton & Sugarcane",
      earning: "₹35,000/month",
      quote:
        "पहले मुझे carbon credit के बारे में कुछ नहीं पता था। अब मैं ���पने 3 एकड़ खेत से हर महीने ₹35,000 कमा रहा हूं। ऐप बहुत आसान है, Marathi में सब कुछ समझ आता है।",
      image: "👨‍🌾",
      rating: 5,
    },
    {
      name: "सुमित्रा देवी",
      location: "बिहार",
      crop: "Rice & Vegetables",
      earning: "₹22,000/month",
      quote:
        "मैं पढ़ी-लिखी नहीं हूं, लेकिन voice command से सब काम हो जाता है। AI से Hindi में पूछती हूं, वो सब बताता है। अब मेरी भी अच्छी कमाई हो रही है।",
      image: "👩‍🌾",
      rating: 5,
    },
    {
      name: "सुरेश चौधरी",
      location: "गुजरात",
      crop: "Groundnut & Cotton",
      earning: "₹40,000/month",
      quote:
        "Technology की वजह से खेती में नया रास्ता मिला है। Satellite से मेरा खेत monitor होता है, payment UPI से मिल जाता है। बहुत smooth process है।",
      image: "👨‍🌾",
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "App Download करें",
      description: "Play Store से Kisan Carbon App download करें",
      icon: Download,
    },
    {
      step: "2",
      title: "Registration करें",
      description: "अपना phone number और खेत की details डालें",
      icon: Smartphone,
    },
    {
      step: "3",
      title: "खेत की Photo लें",
      description: "अपनी फसल की तस्वीर लेकर upload करें",
      icon: Camera,
    },
    {
      step: "4",
      title: "AI Analysis होगा",
      description: "हमारा AI आपकी carbon credits calculate करेगा",
      icon: BarChart3,
    },
    {
      step: "5",
      title: "Payment मिलेगी",
      description: "UPI से सीधे आपके account में पैसे आएंगे",
      icon: Wallet,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-700 text-lg px-6 py-3 font-bold">
              🏆 #1 Kisan Carbon App in India
            </Badge>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Kisan Carbon
              </span>{" "}
              App
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              भारत का पहला{" "}
              <span className="font-bold text-green-600">
                Multilingual Carbon Credit App
              </span>{" "}
              - किसानों के लिए बनाया गया, किसानों के द्वारा tested
            </p>

            {/* App Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
              {appStats.map((stat, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur"
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 hover:from-green-700 hover:via-emerald-700 hover:to-blue-700 text-xl px-12 py-4 font-bold tracking-wide shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <Download className="mr-3 h-6 w-6" />
                Download Kisan App (FREE)
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 text-xl px-8 py-4 font-semibold tracking-wide hover:shadow-lg transition-all duration-200"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo Video
              </Button>
            </div>

            {/* Phone Mockup */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 shadow-inner">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <TreePine className="h-8 w-8 text-green-600 mb-2" />
                        <h4 className="font-bold text-green-800">
                          Carbon Credits
                        </h4>
                        <p className="text-2xl font-bold text-green-600">
                          ₹28,450
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                        <h4 className="font-bold text-blue-800">This Month</h4>
                        <p className="text-2xl font-bold text-blue-600">+67%</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 font-medium">
                        📱 15+ Languages | 🎤 Voice Support | 📴 Offline Mode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why <span className="text-green-600">50,000+ Farmers</span> Love
              Our App
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              विशेष रूप से भारतीय किसानों के लिए designed - सरल, सुरक्षित, और
              सफल
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-green-600 font-semibold mb-3">
                    {feature.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              कैसे काम करता है?{" "}
              <span className="text-green-600">5 Easy Steps</span>
            </h2>
            <p className="text-xl text-gray-600">
              सिर्फ 10 मिनट में शुरू करें, पहले महीने से कमाई शुरू
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {howItWorks.map((step, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg text-center relative"
              >
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    {step.step}
                  </div>
                  <step.icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </CardContent>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-green-600" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Farmer Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Real Farmers,{" "}
              <span className="text-green-600">Real Success Stories</span>
            </h2>
            <p className="text-xl text-gray-600">
              भारत भर के किसान अपनी सफलता की कहानी सुनाते हैं
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {farmerTestimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{testimonial.image}</span>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.location} • {testimonial.crop}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">
                      {testimonial.earning}
                    </Badge>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            🌟 Join 50,000+ Successful Farmers Today!
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Free download, instant setup, monthly payments guaranteed.
            <br />
            <span className="font-bold">पहले महीने में ही earning शुरू!</span>
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8 text-white">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Languages className="h-5 w-5" />
              <span>15+ Languages</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Govt. Approved</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 text-xl px-12 py-4 font-bold tracking-wide shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <Download className="mr-3 h-6 w-6" />
              Download FREE App Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-xl px-8 py-4 font-semibold tracking-wide hover:shadow-lg transition-all duration-200"
            >
              Get WhatsApp Support
            </Button>
          </div>

          <p className="text-green-100 mt-6 text-sm">
            Available on Google Play Store • 100% FREE • No Hidden Charges
          </p>
        </div>
      </section>
    </div>
  );
}

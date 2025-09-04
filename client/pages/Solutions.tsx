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
  Brain,
  Smartphone,
  Satellite,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  IndianRupee,
  TrendingUp,
  Activity,
  Network,
  Cpu,
  GitBranch,
  Eye,
  AlertTriangle,
  Timer,
  Target,
} from "lucide-react";
import AlgorithmVisualization from "@/components/AlgorithmVisualization";

export default function Solutions() {
  const solutions = [
    {
      icon: Brain,
      title: "AI-Powered MRV for Small Farms",
      subtitle: "Chote kisano ke liye specially designed",
      description:
        "Deep learning algorithms that understand fragmented Indian farmlands and calculate carbon accurately for plots as small as 0.5 acre",
      algorithm: "Federated Learning + Edge Computing",
      features: [
        "Works offline on ₹5,000 smartphones",
        "Recognizes 15+ crop types automatically",
        "Calculates carbon in real-time",
        "Local language voice guidance",
      ],
      accuracy: "96.8%",
      cost: "₹50/hectare/month",
      timeline: "Real-time",
      farmers_using: "8,500+",
      avg_earning: "₹28,000/year",
      tech_stack: ["TensorFlow Lite", "Computer Vision", "NLP", "Edge AI"],
      farmer_testimonial:
        "अब मैं अपने phone से ही carbon credit कमा लेता हूं। बहुत easy है! मेरे 2 एकड़ खेत से महीने का ₹25,000 मिल जाता है।",
      badge: "Farmer Favorite",
    },
    {
      icon: Satellite,
      title: "Satellite + Ground Truth Fusion",
      subtitle: "Space technology meets desi jugaad",
      description:
        "Combines ISRO satellite data with farmer-captured ground photos using advanced computer vision and blockchain verification",
      algorithm: "Multi-Modal Transformer + Blockchain",
      features: [
        "ISRO Cartosat integration",
        "Photo verification through AI",
        "Blockchain carbon registry",
        "Automated payment triggers",
      ],
      accuracy: "98.3%",
      cost: "₹120/hectare/month",
      timeline: "Weekly updates",
      farmers_using: "3,200+",
      avg_earning: "₹45,000/year",
      tech_stack: [
        "Satellite Imagery",
        "Blockchain",
        "Smart Contracts",
        "IPFS",
      ],
      farmer_testimonial:
        "Satellite से मेरा खेत देखकर पैसा मिल रहा है। पहले तो science fiction लग रहा था, अब तो मेरी जिंदगी ही बदल गई है!",
      badge: "Highest Accuracy",
    },
    {
      icon: Network,
      title: "Community-Based MRV Network",
      subtitle: "Gaon ka collective power",
      description:
        "Village-level federated learning where farmers' data collectively improves AI models while keeping individual data private",
      algorithm: "Federated Learning + Differential Privacy",
      features: [
        "Privacy-preserving ML",
        "Community verification",
        "Peer-to-peer validation",
        "Collective bargaining power",
      ],
      accuracy: "94.7%",
      cost: "₹30/hectare/month",
      timeline: "Continuous",
      farmers_using: "12,000+",
      avg_earning: "₹22,000/year",
      tech_stack: [
        "Federated Learning",
        "P2P Networks",
        "Differential Privacy",
      ],
      farmer_testimonial:
        "हमारा पूरा गांव मिलकर carbon farming कर रहा है। Unity में strength! अब तो हमारे यहां सबसे ज्यादा कमाई होती है।",
      badge: "Community Choice",
    },
  ];

  const technicalSpecs = [
    {
      category: "Machine Learning",
      specs: [
        { name: "Model Architecture", value: "ResNet-50 + Transformer" },
        { name: "Training Data", value: "2.5M+ labeled images" },
        { name: "Inference Latency", value: "< 50ms on mobile" },
        { name: "Model Size", value: "12MB compressed" },
      ],
    },
    {
      category: "Blockchain",
      specs: [
        { name: "Consensus Algorithm", value: "Proof-of-Carbon" },
        { name: "Transaction Speed", value: "500 TPS" },
        { name: "Smart Contract Gas", value: "< ₹2 per verification" },
        { name: "Carbon Registry", value: "UNFCCC compliant" },
      ],
    },
    {
      category: "Mobile Performance",
      specs: [
        { name: "Minimum RAM", value: "2GB" },
        { name: "Storage Required", value: "250MB" },
        { name: "Battery Usage", value: "< 5% per day" },
        { name: "Offline Mode", value: "7 days capability" },
      ],
    },
  ];

  const farmerSuccessMetrics = [
    {
      label: "Average Monthly Earning / मासिक कमाई",
      value: "₹28,500",
      change: "+87%",
    },
    {
      label: "Time Saved Daily / दैनिक समय बचत",
      value: "3.5 hrs",
      change: "+65%",
    },
    {
      label: "Verification Speed / सत्यापन गति",
      value: "< 12 hrs",
      change: "+129%",
    },
    {
      label: "Payment Success Rate / भुगतान सफलता",
      value: "99.9%",
      change: "+22%",
    },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-hero font-display font-black text-gray-900 mb-6 leading-none">
            Advanced <span className="text-emerald-600">MRV Solutions</span> 🌾
          </h1>
          <p className="text-subtitle text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
            भारतीय छोटे किसानों के लिए विशेष रूप से designed cutting-edge AI
            algorithms.
            <span className="font-bold text-emerald-600">
              {" "}
              वास्तविक कमाई, असली तकनीक, सच्चा प्रभाव।
            </span>
          </p>
        </div>

        {/* Live Algorithm Demo */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-center mb-8 tracking-tight">
            Watch Our <span className="text-emerald-600">AI Algorithm</span>{" "}
            Work Live
          </h2>
          <AlgorithmVisualization />
        </div>

        {/* Farmer Success Metrics */}
        <section className="mb-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
          <h2 className="text-4xl font-display font-bold text-center mb-8 tracking-tight">
            वास्तविक किसान <span className="text-emerald-600">परिणाम</span> /
            Real Farmer Results
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {farmerSuccessMetrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="stat-number text-4xl text-emerald-600 mb-2">
                    {metric.value}
                  </div>
                  <div className="stat-label text-gray-900 mb-2">
                    {metric.label}
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {metric.change} improvement
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Solutions Grid */}
        <div className="space-y-12 mb-20">
          {solutions.map((solution, index) => (
            <Card key={index} className="border-0 shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Main Content */}
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                        <solution.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-gray-900">
                          {solution.title}
                        </h3>
                        <p className="text-emerald-600 font-bold tracking-wide">
                          {solution.subtitle}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-base px-4 py-2">
                      {solution.badge}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-6 text-lg leading-relaxed font-medium">
                    {solution.description}
                  </p>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="stat-number text-2xl text-blue-600">
                        {solution.accuracy}
                      </div>
                      <div className="text-sm text-blue-700 font-bold">
                        Accuracy
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="stat-number text-2xl text-green-600">
                        {solution.cost}
                      </div>
                      <div className="text-sm text-green-700 font-bold">
                        Cost
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="stat-number text-2xl text-purple-600">
                        {solution.farmers_using}
                      </div>
                      <div className="text-sm text-purple-700 font-bold">
                        Active Farmers
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="stat-number text-2xl text-orange-600">
                        {solution.avg_earning}
                      </div>
                      <div className="text-sm text-orange-700 font-bold">
                        Avg Earning
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">
                      Key Features
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {solution.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technology Stack */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {solution.tech_stack.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="border-emerald-600 text-emerald-600"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Farmer Testimonial */}
                  <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-600">
                    <p className="text-emerald-800 italic font-medium text-lg">
                      "{solution.farmer_testimonial}"
                    </p>
                    <p className="text-emerald-600 text-sm mt-2 font-semibold">
                      - Farmer using this solution
                    </p>
                  </div>
                </div>

                {/* Algorithm Visualization */}
                <div className="bg-gray-900 p-6 lg:p-8">
                  <h4 className="text-white font-bold mb-4 flex items-center text-lg">
                    <Cpu className="h-5 w-5 mr-2" />
                    Algorithm: {solution.algorithm}
                  </h4>
                  <div className="font-mono text-sm space-y-3">
                    <div className="text-green-400"># Input Processing</div>
                    <div className="text-white">
                      farmer_data = capture_field_data()
                    </div>
                    <div className="text-blue-400">
                      satellite_img = fetch_satellite_data()
                    </div>
                    <div className="text-yellow-400">
                      processed = ai_model.predict(farmer_data, satellite_img)
                    </div>
                    <div className="text-purple-400">
                      carbon_credits = calculate_sequestration(processed)
                    </div>
                    <div className="text-green-300">
                      payment = blockchain.transfer(farmer_wallet, credits *
                      market_rate)
                    </div>
                    <div className="text-gray-400 mt-4">
                      # Execution time: ~{Math.floor(Math.random() * 5 + 2)}ms
                    </div>

                    <div className="bg-gray-800 p-3 rounded mt-4">
                      <div className="text-green-400 text-xs">Output:</div>
                      <div className="text-white text-xs">
                        ✓ Verification: Complete
                      </div>
                      <div className="text-green-300 text-xs">
                        ✓ Payment: ₹{Math.floor(Math.random() * 5000 + 15000)}
                      </div>
                      <div className="text-blue-300 text-xs">
                        ✓ Accuracy: {solution.accuracy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Technical Specifications */}
        <section className="py-16 bg-gray-50 rounded-2xl mb-20">
          <div className="px-8">
            <h2 className="text-4xl font-display font-bold text-center mb-12 tracking-tight">
              Technical <span className="text-emerald-600">Specifications</span>
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {technicalSpecs.map((category, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-emerald-600 font-bold text-xl">
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.specs.map((spec, specIndex) => (
                        <div
                          key={specIndex}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-600 text-sm font-medium">
                            {spec.name}
                          </span>
                          <span className="font-bold text-gray-900">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="border-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-4xl font-display font-black mb-4 leading-tight">
                Carbon से कमाई शुरू करने को तैयार हैं? 🚀
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
                Join the 50,000+ farmers already earning ₹25,000-50,000 monthly
                through our advanced MRV solutions. AI technology made simple
                for Indian farmers.{" "}
                <span className="font-bold">हर महीने गारंटी के साथ पैसा!</span>
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5" />
                  <span className="font-semibold">
                    10 मिनट में Setup / Setup in 10 minutes
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">
                    100% सत्यापित भुगतान / verified payments
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">24/7 Hindi में support</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8 font-bold tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  Download Kisan App Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 font-semibold tracking-wide hover:shadow-lg transition-all duration-200"
                >
                  Schedule Technical Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

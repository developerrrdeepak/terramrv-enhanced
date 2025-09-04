import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TreePine,
  Users,
  Target,
  Lightbulb,
  Globe,
  Award,
  Leaf,
  TrendingUp,
  Shield,
  Heart,
} from "lucide-react";

export default function AboutUs() {
  const team = [
    {
      name: "Swapn Kumar",
      role: "Climate Scientist",
      description: "Leading expert in agricultural carbon sequestration",
      image: "👨‍🌾",
    },
    {
      name: "Deepak",
      role: "Technology Lead",
      description: "Developing MRV solutions for smallholder farmers",
      image: "👩‍💻",
    },
    {
      name: "Ravi",
      role: "Rural Development",
      description: "20+ years experience in farmer outreach programs",
      image: "👨‍🏫",
    },
    {
      name: "Swapna Kumar",
      role: "Data Scientist",
      description: "AI/ML specialist for satellite monitoring",
      image: "👨‍🔬",
    },
  ];

  const achievements = [
    { number: "50,000+", label: "Farmers Registered", icon: Users },
    { number: "125,000", label: "Hectares Monitored", icon: Globe },
    { number: "85,000", label: "Carbon Credits Generated", icon: TreePine },
    { number: "₹2.5 Cr", label: "Farmer Income Generated", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 p-4 rounded-2xl shadow-lg">
              <TreePine className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent">
              TerraMRV
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Empowering India's smallholder farmers through technology-driven
            carbon credit solutions. We make MRV (Monitoring, Reporting &
            Verification) accessible, affordable, and accurate.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">
              Climate Technology
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
              AgriTech
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-sm">
              Carbon Credits
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">
              Sustainable Agriculture
            </Badge>
          </div>

          {/* Hero Image */}
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.pexels.com/photos/30133676/pexels-photo-30133676.jpeg"
                alt="Shepherd with herd of goats on lush country road in rural India showcasing agricultural landscape"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-2xl font-bold mb-2">
                  Transforming Rural Lives
                </p>
                <p className="text-lg opacity-90">
                  Through Climate-Smart Agriculture
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-green-600" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To democratize access to carbon markets for India's 86%
                  smallholder farmers through innovative MRV technology,
                  enabling them to earn additional income while contributing to
                  global climate action.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                  <span>Our Vision</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  A future where every farmer in India can participate in carbon
                  markets, transforming agriculture into a climate solution
                  while improving rural livelihoods and food security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Measurable results in empowering farmers and fighting climate
              change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full">
                      <achievement.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-green-600 mb-2">
                    {achievement.number}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {achievement.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-gray-600">
                  Complete transparency in MRV processes, ensuring credible and
                  verifiable carbon credits
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <Heart className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Farmer-First</h3>
                <p className="text-gray-600">
                  Putting farmer needs and financial wellbeing at the center of
                  our technology solutions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <Leaf className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  Long-term thinking that balances environmental protection with
                  economic development
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experts in climate science, technology, and rural development
              working together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Approach */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Technology
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combining cutting-edge technology with ground-level implementation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Satellite Monitoring</CardTitle>
                <CardDescription>
                  Real-time crop and land use monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• NDVI analysis for biomass estimation</li>
                  <li>• Canopy cover detection</li>
                  <li>• Change detection algorithms</li>
                  <li>• Weather pattern integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>IoT Sensors</CardTitle>
                <CardDescription>Ground-level data collection</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Soil moisture monitoring</li>
                  <li>• pH level tracking</li>
                  <li>• Water usage measurement</li>
                  <li>• Environmental condition logging</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI/ML Analytics</CardTitle>
                <CardDescription>
                  Intelligent carbon credit calculation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Predictive carbon sequestration models</li>
                  <li>• Fraud detection algorithms</li>
                  <li>• Yield prediction systems</li>
                  <li>• Risk assessment tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Technology</CardTitle>
                <CardDescription>Farmer-friendly interfaces</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Offline-capable mobile apps</li>
                  <li>• Multi-language support</li>
                  <li>• Simple data entry forms</li>
                  <li>• SMS-based notifications</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join the Climate Revolution
          </h2>
          <p className="text-xl text-green-50 mb-8 leading-relaxed">
            Whether you're a farmer, investor, or climate advocate, there's a
            place for you in our mission to transform agriculture into a climate
            solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-50 font-bold"
            >
              Become a Partner
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

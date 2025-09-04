import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  comingSoonFeatures?: string[];
}

export default function PlaceholderPage({
  title,
  description,
  comingSoonFeatures,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-2xl mx-auto">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            {comingSoonFeatures && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Coming Soon:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {comingSoonFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-left"
                    >
                      <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-gray-600 mb-8">
              This section is currently under development. Continue the
              conversation to help us build out this page with the specific
              content and features you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Request This Feature
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

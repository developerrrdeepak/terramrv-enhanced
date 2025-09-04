import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Cpu, Network, Activity, Zap, GitBranch } from "lucide-react";
import { useState, useEffect } from "react";

interface AlgorithmStep {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed";
  progress: number;
  latency: string;
  description: string;
}

export default function AlgorithmVisualization() {
  const [steps, setSteps] = useState<AlgorithmStep[]>([
    {
      id: "data_ingestion",
      name: "Satellite Data Ingestion",
      status: "pending",
      progress: 0,
      latency: "0ms",
      description: "Multi-spectral imagery preprocessing",
    },
    {
      id: "feature_extraction",
      name: "CNN Feature Extraction",
      status: "pending",
      progress: 0,
      latency: "0ms",
      description: "ResNet-50 backbone processing",
    },
    {
      id: "attention_mechanism",
      name: "Transformer Attention",
      status: "pending",
      progress: 0,
      latency: "0ms",
      description: "Spatial attention for biomass regions",
    },
    {
      id: "biomass_calculation",
      name: "Biomass Estimation",
      status: "pending",
      progress: 0,
      latency: "0ms",
      description: "Neural network prediction layer",
    },
    {
      id: "blockchain_verification",
      name: "Blockchain Verification",
      status: "pending",
      progress: 0,
      latency: "0ms",
      description: "Smart contract validation",
    },
  ]);

  useEffect(() => {
    const runAlgorithm = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Start processing current step
        setSteps((prev) =>
          prev.map((step, index) =>
            index === i ? { ...step, status: "processing", progress: 0 } : step,
          ),
        );

        // Animate progress
        for (let progress = 0; progress <= 100; progress += 5) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          setSteps((prev) =>
            prev.map((step, index) =>
              index === i
                ? {
                    ...step,
                    progress,
                    latency: `${Math.floor(Math.random() * 50 + 10)}ms`,
                  }
                : step,
            ),
          );
        }

        // Complete current step
        setSteps((prev) =>
          prev.map((step, index) =>
            index === i
              ? {
                  ...step,
                  status: "completed",
                  progress: 100,
                  latency: `${Math.floor(Math.random() * 20 + 5)}ms`,
                }
              : step,
          ),
        );

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Reset after completion
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) => ({
            ...step,
            status: "pending",
            progress: 0,
            latency: "0ms",
          })),
        );
      }, 3000);
    };

    const interval = setInterval(runAlgorithm, 8000);
    runAlgorithm(); // Run immediately

    return () => clearInterval(interval);
  }, []);

  const getStepIcon = (id: string) => {
    switch (id) {
      case "data_ingestion":
        return Activity;
      case "feature_extraction":
        return Brain;
      case "attention_mechanism":
        return Network;
      case "biomass_calculation":
        return Cpu;
      case "blockchain_verification":
        return GitBranch;
      default:
        return Zap;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-200 text-gray-600";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-green-400" />
          <span className="font-display font-bold text-xl">
            Live ML Pipeline
          </span>
          <Badge className="bg-green-500 text-white animate-pulse font-bold tracking-wide">
            Processing
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="font-mono text-sm text-green-400 mb-4 font-semibold">
          # Deep Learning Carbon Estimation Pipeline
        </div>

        {steps.map((step, index) => {
          const StepIcon = getStepIcon(step.id);
          return (
            <div
              key={step.id}
              className="border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <StepIcon
                    className={`h-5 w-5 ${
                      step.status === "completed"
                        ? "text-green-400"
                        : step.status === "processing"
                          ? "text-blue-400"
                          : "text-gray-400"
                    }`}
                  />
                  <span className="font-semibold text-lg">{step.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(step.status)}>
                    {step.status}
                  </Badge>
                  <span className="text-xs text-gray-400">{step.latency}</span>
                </div>
              </div>

              <div className="mb-2">
                <Progress
                  value={step.progress}
                  className={`h-2 ${
                    step.status === "completed"
                      ? "text-green-400"
                      : step.status === "processing"
                        ? "text-blue-400"
                        : ""
                  }`}
                />
              </div>

              <p className="text-sm text-gray-400 font-medium">
                {step.description}
              </p>

              {step.status === "processing" && (
                <div className="font-mono text-xs text-yellow-400 mt-2 font-medium">
                  → Executing: model.forward(tensor_batch[{index}])
                </div>
              )}

              {step.status === "completed" && (
                <div className="font-mono text-xs text-green-400 mt-2 font-medium">
                  ✓ Output: tensor({step.progress}% confidence)
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <div className="font-mono text-xs space-y-1 font-medium">
            <div className="text-green-400 font-semibold"># Final Output</div>
            <div className="text-white">carbon_credits = 15.7 tonnes CO2e</div>
            <div className="text-blue-400">verification_hash = 0x7a8b9c...</div>
            <div className="text-yellow-400 font-semibold">
              farmer_payment = ₹23,550
            </div>
            <div className="text-purple-400">blockchain_confirmed = True</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

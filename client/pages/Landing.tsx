import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  Satellite,
  TreePine as TreeIcon,
  Cpu,
  FileLock2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const trendData = [
  { name: "2019", value: 20 },
  { name: "2020", value: 40 },
  { name: "2021", value: 75 },
  { name: "2022", value: 110 },
  { name: "2023", value: 170 },
  { name: "2024", value: 240 },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-14">
          <Badge className="bg-primary/10 border-primary/30 text-primary-foreground/80 animate-fade-in">
            TerraMRV • AI Powered
          </Badge>
          <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight animate-slide-up">
            <span className="text-foreground">Discover Your Path to </span>
            <span className="text-primary">Carbon Income</span>
          </h1>
          <p className="mt-4 sm:mt-5 max-w-2xl text-foreground/80 text-base sm:text-lg leading-relaxed">
            AI-powered tools to calculate, verify, and maximize carbon credits
            for farmers and organizations.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link to="/tools">Estimate Credits</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary/50 text-primary-foreground hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              <Link to="/solutions">Explore Features</Link>
            </Button>
          </div>
        </div>
        {/* Background gradient for mobile */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Feature highlights */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Satellite,
              title: "Satellite MRV",
              desc: "Vegetation, land cover, soil moisture",
            },
            {
              icon: TreeIcon,
              title: "Agroforestry",
              desc: "Tree growth, biomass, SOC",
            },
            {
              icon: Cpu,
              title: "IoT Sensors",
              desc: "Soil moisture, weather data",
            },
            {
              icon: FileLock2,
              title: "Audit Trails",
              desc: "Immutable logs, transparency",
            },
          ].map((f, i) => (
            <Card
              key={i}
              className="border-primary/30 bg-secondary text-foreground"
            >
              <CardHeader className="pb-3">
                <div className="w-9 h-9 rounded-md border border-primary/30 flex items-center justify-center">
                  <f.icon className="w-4.5 h-4.5 text-emerald-300" />
                </div>
                <CardTitle className="mt-3 text-foreground text-lg">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/80 text-sm leading-relaxed">
                {f.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "1,50,000+", v: "Farmers Onboarded" },
            { k: "₹50+", v: "Monthly Carbon Income" },
            { k: "15+", v: "Local Languages Supported" },
            { k: "24/7", v: "Customer Support" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-5 bg-primary/10 border border-primary/30"
            >
              <div className="text-3xl font-extrabold text-primary-foreground/90">
                {s.k}
              </div>
              <div className="text-foreground/80 mt-1 text-sm font-medium">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl p-5 bg-secondary border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-300" />
                <span className="font-semibold">Verification Progress</span>
              </div>
              <span className="text-emerald-300 font-semibold">60%</span>
            </div>
            <div className="relative h-2.5 w-full rounded-full bg-foreground/20 overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-emerald-500 to-green-400" />
            </div>
            <div className="grid grid-cols-4 text-xs mt-3 text-foreground/80">
              <div className="flex items-center justify-between">
                <span>Profile</span>
                <span>20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data</span>
                <span>55%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verification</span>
                <span>75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Issued</span>
                <span>90%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights / News + Trend */}
      <section className="py-10 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-2">
          {/* News */}
          <div className="space-y-4">
            {[
              {
                img: "https://images.pexels.com/photos/1605270/pexels-photo-1605270.jpeg",
                title: "Remote Work is Here to Stay: Why",
                desc: "Exploring the lasting impact of remote work on the global job market and company culture.",
              },
              {
                img: "https://images.pexels.com/photos/28270760/pexels-photo-28270760.jpeg",
                title: "AI in Agriculture: The Next Frontier",
                desc: "How AI is improving diagnostics, field measurements, and yield forecasting.",
              },
            ].map((n, i) => (
              <Card
                key={i}
                className="overflow-hidden border-primary/30 bg-secondary hover:shadow-lg transition-shadow duration-300"
              >
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-3 sm:gap-4">
                  <img
                    src={n.img}
                    alt={n.title}
                    className="h-24 sm:h-28 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-3 sm:p-4">
                    <h4 className="font-semibold text-white line-clamp-2 text-sm sm:text-base">
                      {n.title}
                    </h4>
                    <p className="text-sm text-slate-300 line-clamp-2 mt-1 hidden sm:block">
                      {n.desc}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-1 sm:hidden">
                      {n.desc}
                    </p>
                    <Button
                      variant="link"
                      className="text-emerald-300 p-0 mt-1 text-xs sm:text-sm hover:text-emerald-200 transition-colors"
                    >
                      Read More <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trend Chart (CSS-based) */}
          <Card className="border-emerald-900/40 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-foreground">
                Carbon Credit Growth Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendData.map((d) => (
                  <div
                    key={d.name}
                    className="grid grid-cols-[60px_1fr_50px] items-center gap-3"
                  >
                    <span className="text-foreground/80 text-sm">{d.name}</span>
                    <div className="h-4 bg-foreground/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(d.value / Math.max(...trendData.map((t) => t.value))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-primary-foreground/80 font-semibold text-sm">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

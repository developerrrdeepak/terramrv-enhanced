import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const days = [
  { d: "Mon", t: 30, r: 10 },
  { d: "Tue", t: 31, r: 0 },
  { d: "Wed", t: 29, r: 20 },
  { d: "Thu", t: 28, r: 60 },
  { d: "Fri", t: 27, r: 5 },
  { d: "Sat", t: 26, r: 0 },
  { d: "Sun", t: 28, r: 30 },
];

export default function WeatherCard() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>7-day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto py-2">
          {days.map((day) => (
            <div key={day.d} className="min-w-[84px] bg-[#F9F9F9] rounded-xl p-2 text-center">
              <div className="text-sm font-medium text-gray-700">{day.d}</div>
              <div className="text-lg font-bold text-[#2196F3]">{day.t}°C</div>
              <div className="text-xs text-gray-500">{day.r}% rain</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

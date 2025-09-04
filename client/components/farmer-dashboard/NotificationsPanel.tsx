import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const alerts = [
  { id: 1, level: "warning", text: "Irrigation needed in Field B", when: "2h" },
  { id: 2, level: "danger", text: "Pest warning: aphids detected", when: "1d" },
  { id: 3, level: "info", text: "Rain expected tomorrow", when: "6h" },
];

export default function NotificationsPanel() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 bg-[#F9F9F9] p-3 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-[#795548]" />
              <div>
                <div className="font-medium">{a.text}</div>
                <div className="text-xs text-gray-500">{a.when} ago</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

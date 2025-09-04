import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

const payments = [
  { id: 1, date: "2025-08-01", amount: 4500, method: "UPI" },
  { id: 2, date: "2025-06-12", amount: 3200, method: "Bank" },
];

export default function PaymentsCard() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Recent Payouts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-lg"
            >
              <div>
                <div className="font-medium">{p.method}</div>
                <div className="text-xs text-gray-500">{p.date}</div>
              </div>
              <div className="text-sm font-semibold text-[#795548]">
                <IndianRupee className="inline w-4 h-4 mr-1" />
                {p.amount}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

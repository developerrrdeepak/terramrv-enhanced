import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const payments = [
  { id: 1, date: "2025-08-01", amount: 4500, method: "UPI" },
  { id: 2, date: "2025-06-12", amount: 3200, method: "Bank" },
];

function PaymentsCard() {
  const { t } = useI18n();
  return (
    <Card className="rounded-2xl shadow-sm card-interactive card-soft">
      <CardHeader>
        <CardTitle>{t("recentPayouts")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-[hsl(var(--muted))] p-2 rounded-lg"
            >
              <div>
                <div className="font-medium">{p.method}</div>
                <div className="text-xs text-gray-500">{p.date}</div>
              </div>
              <div className="text-sm font-semibold text-[hsl(var(--secondary))]">
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

export default React.memo(PaymentsCard);

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const chartData = Array.from({ length: 6 }).map((_, i) => ({
  month: new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString("en-US", { month: "short" }),
  credits: Math.round(10 + Math.sin((i / 6) * Math.PI) * 5),
}));

function CarbonWalletCard({ credits = 25, co2 = 12 }: { credits?: number; co2?: number }) {
  const { t } = useI18n();
  return (
    <Card className="rounded-2xl shadow-sm card-interactive card-soft">
      <CardHeader>
        <CardTitle>{t('carbonWallet')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">{credits} credits</div>
            <div className="text-sm text-gray-600">{co2} tCO₂ saved</div>
          </div>
          <div className="w-40 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area type="monotone" dataKey="credits" stroke="hsl(var(--primary))" fill="#CFF8DC" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="text-sm text-gray-600">Estimated value: <span className="font-semibold">₹{credits * 200}</span></div>
      </CardContent>
    </Card>
  );
}

export default React.memo(CarbonWalletCard);

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const alerts = [
  { id: 1, level: 'warning', text: 'Irrigation needed in Field B', when: '2h' },
  { id: 2, level: 'danger', text: 'Pest warning: aphids detected', when: '1d' },
  { id: 3, level: 'info', text: 'Rain expected tomorrow', when: '6h' },
];

function NotificationsPanel() {
  const { t } = useI18n();
  return (
    <Card className="rounded-2xl shadow-sm card-soft micro-fade-in">
      <CardHeader>
        <CardTitle>{t('alertsNotifications')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map(a => (
            <div key={a.id} className="flex items-start gap-3 bg-[hsl(var(--muted))] p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 text-[hsl(var(--secondary))]" />
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

export default React.memo(NotificationsPanel);

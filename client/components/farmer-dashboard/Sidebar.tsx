import React, { useState } from "react";
import { Home, MapPin, Leaf, CloudDrizzle, CreditCard, HelpCircle } from "lucide-react";

function Sidebar() {
  const [active, setActive] = useState<string>("Overview");

  const items = [
    { key: "Overview", icon: <Home className="w-5 h-5 text-[#4CAF50]" /> },
    { key: "Farm Map", icon: <MapPin className="w-5 h-5 text-[#795548]" /> },
    { key: "Carbon Wallet", icon: <Leaf className="w-5 h-5 text-[#4CAF50]" /> },
    { key: "Weather", icon: <CloudDrizzle className="w-5 h-5 text-[#2196F3]" /> },
    { key: "Payments", icon: <CreditCard className="w-5 h-5 text-[#795548]" /> },
    { key: "Help", icon: <HelpCircle className="w-5 h-5 text-[#795548]" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-sm sticky top-6 h-[calc(100vh-96px)] w-56">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white font-bold">FR</div>
        <div>
          <div className="font-semibold text-gray-900">FarmRoots</div>
          <div className="text-xs text-gray-500">Dashboard</div>
        </div>
      </div>

      <nav className="mt-4 flex flex-col gap-2" aria-label="Main navigation">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-green-200 ${
                isActive ? "bg-[hsl(var(--sidebar-primary))]/10 border-l-4 border-l-[#4CAF50]" : "hover:bg-emerald-50"
              }`}
            >
              {it.icon}
              <span className="font-medium">{it.key}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto text-xs text-gray-500">
        <div>Last sync: <span className="font-medium text-gray-700">5m</span></div>
        <div className="mt-2">Connection: <span className="font-medium text-green-600">Online</span></div>
      </div>
    </aside>
  );
}

export default React.memo(Sidebar);

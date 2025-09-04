import React from "react";
import {
  Home,
  MapPin,
  Leaf,
  CloudDrizzle,
  CreditCard,
  HelpCircle,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-sm sticky top-6 h-[calc(100vh-96px)] w-56">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white font-bold">
          FR
        </div>
        <div>
          <div className="font-semibold text-gray-900">FarmRoots</div>
          <div className="text-xs text-gray-500">Dashboard</div>
        </div>
      </div>

      <nav className="mt-4 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 text-left">
          <Home className="w-5 h-5 text-[#4CAF50]" />
          <span className="font-medium">Overview</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 text-left">
          <MapPin className="w-5 h-5 text-[#795548]" />
          <span className="font-medium">Farm Map</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 text-left">
          <Leaf className="w-5 h-5 text-[#4CAF50]" />
          <span className="font-medium">Carbon Wallet</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 text-left">
          <CloudDrizzle className="w-5 h-5 text-[#2196F3]" />
          <span className="font-medium">Weather</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 text-left">
          <CreditCard className="w-5 h-5 text-[#795548]" />
          <span className="font-medium">Payments</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-emerald-50 text-left">
          <HelpCircle className="w-5 h-5 text-[#795548]" />
          <span className="font-medium">Help</span>
        </button>
      </nav>

      <div className="mt-auto text-xs text-gray-500">
        <div>
          Last sync: <span className="font-medium text-gray-700">5m</span>
        </div>
        <div className="mt-2">
          Connection: <span className="font-medium text-green-600">Online</span>
        </div>
      </div>
    </aside>
  );
}

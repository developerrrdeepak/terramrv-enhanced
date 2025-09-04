import React from "react";
import {
  Home,
  MapPin,
  Leaf,
  CloudDrizzle,
  CreditCard,
  HelpCircle,
} from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-sm px-4 py-2 w-[92%] max-w-3xl flex justify-between items-center md:hidden">
      <button className="flex flex-col items-center text-sm text-gray-600">
        <Home className="w-5 h-5 text-[#4CAF50]" />
        <span>Home</span>
      </button>
      <button className="flex flex-col items-center text-sm text-gray-600">
        <MapPin className="w-5 h-5 text-[#795548]" />
        <span>Map</span>
      </button>
      <button className="flex flex-col items-center text-sm text-gray-600">
        <Leaf className="w-5 h-5 text-[#4CAF50]" />
        <span>Credits</span>
      </button>
      <button className="flex flex-col items-center text-sm text-gray-600">
        <CloudDrizzle className="w-5 h-5 text-[#2196F3]" />
        <span>Weather</span>
      </button>
      <button className="flex flex-col items-center text-sm text-gray-600">
        <CreditCard className="w-5 h-5 text-[#795548]" />
        <span>Pay</span>
      </button>
    </nav>
  );
}

import React from "react";
import { Bell } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import DarkModeToggle from "./DarkModeToggle";

function Header() {
  return (
    <header className="w-full flex items-center justify-between py-3 px-4 bg-[#F9F9F9] rounded-2xl shadow-sm micro-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white font-bold">FR</div>
        <div>
          <div className="text-lg font-semibold text-gray-900">FarmRoots</div>
          <div className="text-sm text-gray-500">Farmer Dashboard</div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <LanguageToggle />
        <DarkModeToggle />
        <button
          aria-label="Notifications"
          className="p-2 rounded-lg bg-white shadow-sm border focus-ring"
        >
          <Bell className="w-5 h-5 text-[#4CAF50]" />
        </button>
      </div>
    </header>
  );
}

export default React.memo(Header);

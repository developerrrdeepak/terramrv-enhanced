import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return document.documentElement.classList.contains("dark");
    } catch { return false; }
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button aria-pressed={dark} onClick={() => setDark(!dark)} className="p-2 rounded-md bg-white border focus-ring">
      {dark ? <Sun className="w-5 h-5 text-yellow-500"/> : <Moon className="w-5 h-5 text-gray-600"/>}
    </button>
  );
}

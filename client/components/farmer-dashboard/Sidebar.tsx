import React, { useRef, useEffect } from "react";
import {
  Home,
  MapPin,
  Leaf,
  CloudDrizzle,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

type Props = {
  active?: string;
  onSelect?: (key: string) => void;
};

function Sidebar({ active = "Overview", onSelect }: Props) {
  const { t } = useI18n();

  const items = [
    {
      key: t("overview"),
      id: "Overview",
      icon: <Home className="w-5 h-5 text-[hsl(var(--primary))]" />,
    },
    {
      key: t("map"),
      id: "Farm Map",
      icon: <MapPin className="w-5 h-5 text-[#795548]" />,
    },
    {
      key: t("carbon"),
      id: "Carbon Wallet",
      icon: <Leaf className="w-5 h-5 text-[hsl(var(--primary))]" />,
    },
    {
      key: t("overview"),
      id: "Weather",
      icon: <CloudDrizzle className="w-5 h-5 text-[hsl(var(--accent))]" />,
    },
    {
      key: t("overview"),
      id: "Payments",
      icon: <CreditCard className="w-5 h-5 text-[#795548]" />,
    },
    {
      key: t("overview"),
      id: "Help",
      icon: <HelpCircle className="w-5 h-5 text-[#795548]" />,
    },
  ];

  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const btn = container.querySelector<HTMLButtonElement>(
      `button[data-key="${active}"]`,
    );
    // clear aria-current on all
    container
      .querySelectorAll<HTMLButtonElement>("button[data-nav-item]")
      .forEach((b) => b.removeAttribute("aria-current"));
    if (btn) btn.setAttribute("aria-current", "page");
  }, [active]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const container = navRef.current;
    if (!container) return;
    const btns = Array.from(
      container.querySelectorAll<HTMLButtonElement>("button[data-nav-item]"),
    );
    const idx = btns.findIndex((el) => el === document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = btns[(idx + 1) % btns.length];
      next?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = btns[(idx - 1 + btns.length) % btns.length];
      prev?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      btns[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      btns[btns.length - 1]?.focus();
    }
  };

  return (
    <aside
      className="hidden lg:flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-sm sticky top-6 h-[calc(100vh-96px)] w-56"
      data-testid="sidebar"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center text-white font-bold">
          FR
        </div>
        <div>
          <div className="font-semibold text-gray-900">FarmRoots</div>
          <div className="text-xs text-gray-500">Dashboard</div>
        </div>
      </div>

      <nav
        ref={navRef}
        onKeyDown={handleKeyDown}
        className="mt-4 flex flex-col gap-2"
        aria-label="Main navigation"
      >
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              data-nav-item
              data-key={it.key}
              onClick={() => onSelect?.(it.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(it.key);
                }
              }}
              tabIndex={0}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-[rgba(76,175,80,0.12)] transition-colors ${
                isActive
                  ? "bg-[hsl(var(--sidebar-primary))]/10 border-l-4 border-l-[hsl(var(--primary))]"
                  : "hover:bg-emerald-50"
              }`}
            >
              {it.icon}
              <span className="font-medium">{it.key}</span>
            </button>
          );
        })}
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

export default React.memo(Sidebar);

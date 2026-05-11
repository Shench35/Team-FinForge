import { useState } from "react";
import { Home, Search, Clock, Cog, User } from "lucide-react";

type NavTab = "home" | "verify" | "history" | "settings" | "profile";

interface MobileBottomNavProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
}

const MobileBottomNav = ({
  activeTab: initialTab = "home",
  onTabChange,
}: MobileBottomNavProps) => {
  const [activeTab, setActiveTab] = useState<NavTab>(initialTab);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const tabs: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: "home", label: "Home", icon: <Home size={24} /> },
    { id: "verify", label: "Verify", icon: <Search size={24} /> },
    { id: "history", label: "History", icon: <Clock size={24} /> },
    { id: "settings", label: "Settings", icon: <Cog size={24} /> },
    { id: "profile", label: "Profile", icon: <User size={24} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-highest border-t border-outline z-40">
      <div className="flex items-center justify-around h-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors ${
              activeTab === tab.id
                ? "text-secondary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.icon}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

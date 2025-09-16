import { useState } from "react";

export type TabType = "portfolio" | "insights" | "activity" | "rewards" | "referrals";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "portfolio", label: "Portfolio" },
  { id: "insights", label: "Insights" },
  { id: "activity", label: "Activity" },
  { id: "rewards", label: "Rewards" },
  { id: "referrals", label: "Referrals" },
];

export function TabNavigation({ activeTab, onTabChange, className = "" }: TabNavigationProps) {
  return (
    <div className={`border-b border-gray-800 ${className}`}>
      <div className="px-4">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-green-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// Hook for managing tab state
export function useTabNavigation(defaultTab: TabType = "portfolio") {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  
  return {
    activeTab,
    setActiveTab,
  };
}
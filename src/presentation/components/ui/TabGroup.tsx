"use client";

import { cn } from "@/presentation/utils/cn";

interface TabGroupProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function TabGroup({ tabs, activeTab, onChange }: TabGroupProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-surface p-1 border border-border">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-lg transition-all",
              isActive
                ? "bg-surface-hover text-primary shadow-glow-green-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/50"
            )}
          >
            {tab}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

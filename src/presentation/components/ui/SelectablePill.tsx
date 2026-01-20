import { cn } from "@/presentation/utils/cn";

interface SelectablePillProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function SelectablePill({ label, isSelected, onClick }: SelectablePillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
        "border hover:scale-105 active:scale-95",
        isSelected
          ? "border-primary bg-primary-muted text-primary shadow-glow-green-sm"
          : "border-border bg-transparent text-text-muted hover:border-text-muted hover:text-text-secondary"
      )}
    >
      {label}
    </button>
  );
}

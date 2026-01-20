import { cn } from "@/presentation/utils/cn";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
}

export function PrimaryButton({
  children,
  variant = "solid",
  size = "md",
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "solid" && [
          "bg-primary text-black",
          "hover:bg-primary-hover hover:shadow-glow-green-sm",
          "active:bg-primary-active active:scale-95",
        ],
        variant === "outline" && [
          "border-2 border-primary text-primary bg-transparent",
          "hover:bg-primary-muted",
          "active:scale-95",
        ],
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-base",
        size === "lg" && "px-6 py-3 text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

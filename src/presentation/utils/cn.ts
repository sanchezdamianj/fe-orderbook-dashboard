import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

// # Utility Functions

// ## `cn()` - Class Name Utility

// **Purpose**: Merges Tailwind CSS classes intelligently, handling conflicts and conditional classes.

// **How it works**:
// 1. `clsx`: Conditionally constructs className strings
// 2. `twMerge`: Merges Tailwind classes, resolving conflicts (e.g., `px-2 px-4` → `px-4`)

// **Example**:
// ```typescript
// cn("px-2 py-1", condition && "bg-blue-500", "px-4")
// // Result: "py-1 px-4 bg-blue-500"  (px-4 overwrites px-2)
// ```

// **Common use case**: Dynamic component styling with conditional and conflicting classes.

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

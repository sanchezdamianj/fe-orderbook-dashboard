/**
 * Utility Tests: cn (className utility)
 */

import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn utility", () => {
  it("should merge class names", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toContain("text-red-500");
    expect(result).toContain("bg-blue-500");
  });

  it("should handle conditional classes", () => {
    const result = cn("base-class", true && "conditional-class");
    expect(result).toContain("base-class");
    expect(result).toContain("conditional-class");
  });

  it("should handle undefined values", () => {
    const result = cn("text-red-500", undefined, "bg-blue-500");
    expect(result).toContain("text-red-500");
    expect(result).toContain("bg-blue-500");
  });

  it("should merge conflicting tailwind classes", () => {
    // tailwind-merge should handle conflicts
    const result = cn("p-4", "p-2");
    expect(result).toBe("p-2"); // Later class wins
  });
});

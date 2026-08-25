import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMemberId(id: number | string | undefined | null) {
  if (!id) return "RAVP-2026-0000000000000000";
  return `RAVP-2026-${String(id).padStart(16, '0')}`;
}

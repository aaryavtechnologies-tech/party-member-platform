import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMemberId(id: number | string | undefined | null) {
  const currentYear = new Date().getFullYear();
  if (!id) return `RAVP-${currentYear}-0000000000000000`;
  return `RAVP-${currentYear}-${String(id).padStart(16, '0')}`;
}

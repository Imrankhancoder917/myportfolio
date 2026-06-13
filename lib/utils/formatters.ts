const isInvalidNumber = (num?: number | null): boolean => {
  return num == null || Number.isNaN(num) || !Number.isFinite(num);
};

// Format a number as an exact, comma-separated string for display (e.g. 1,047).
// Returns '—' for null/undefined/NaN/Infinity.
export const formatNumber = (num?: number | null): string => {
  if (isInvalidNumber(num)) return "—";
  // Use Intl to ensure consistent grouping separators for en-US locale.
  return Number(num).toLocaleString("en-US");
};

// Format an integer (rounds any fractional input) with grouping separators.
export const formatInteger = (num?: number | null): string => {
  if (isInvalidNumber(num)) return "—";
  return Math.round(Number(num)).toLocaleString("en-US");
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatStreak = (days: number): string => {
  return `${days} day${days !== 1 ? "s" : ""}`;
};

export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100);
};

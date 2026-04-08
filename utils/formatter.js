// Date logic formatting, can be shared across the  controllers
// utils/formatters.js

/**
 * A robust date formatter that won't crash on null/undefined
 * @param {string|Date} iso - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @param {string} fallback - What to return if date is missing
 */
const baseFormat = (iso, options, fallback = "") => {
  if (!iso) return fallback;
  try {
    const date = new Date(iso);
    // Check if the date is actually valid (e.g. not "abc")
    if (isNaN(date.getTime())) return fallback;
    return date.toLocaleString("en-GB", options);
  } catch (e) {
    return fallback;
  }
};

// 1. For Course Cards (Dates only: 7 Apr 2026)
export const fmtDateOnly = (iso) => 
  baseFormat(iso, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// 2. For Sessions (Full detail: Tue, 7 Apr 2026, 10:00)
export const fmtDate = (iso) => 
  baseFormat(iso, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }, "TBA"); // Returns TBA if no session time exists
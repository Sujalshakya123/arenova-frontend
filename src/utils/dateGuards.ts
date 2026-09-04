/** Local calendar date as YYYY-MM-DD (avoids UTC day shift from toISOString). */
export const localTodayIso = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** True when value is a YYYY-MM-DD date strictly before today (local). */
export const isPastIsoDate = (value: string) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return value < localTodayIso();
};
